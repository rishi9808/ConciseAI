"use client";
import { Loader2, UploadCloud } from "lucide-react";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary, storePdfSummary } from "@/actions/uploadActions";
import { useRouter } from "next/navigation";

function UploadPDFForm({
  isUploading,
  setIsUploading,
}: {
  isUploading?: boolean;
  setIsUploading: (v: boolean) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const schema = z.object({
    file: z
      .instanceof(File, {
        message: "Please select a valid PDF file.",
      })
      .refine(
        (file) => file.size <= 20 * 1024 * 1024,
        "File size must be less than 20MB."
      )
      .refine((file) => file.type === "application/pdf", "File must be a PDF."),
  });

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.success("PDF uploaded successfully!", { id: "upload" });
    },
    onUploadError: (error) => {
      setIsUploading(false);
      toast.error("Upload failed:" + error.message, { id: "upload" });
    },
    onUploadBegin: () => {
      setIsUploading(true);
      toast.loading("Upload started", { id: "upload" });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("File selected for upload:", selectedFile);
    if (!selectedFile) {
      toast.warning("Please select a PDF file to upload.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validatedFields = schema.safeParse({ file });
    if (!validatedFields.success) {
      toast.error(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
      );
      return;
    }
    // Upload the file using UploadThing
    const resp = await startUpload([file]);
    if (!resp || resp.length === 0) {
      toast.error("Upload failed. Please try again.");
      return;
    }

    const summaryToastId = toast.loading("Generating PDF summary...", {
      id: "summary",
    });

    try {
      const summary = await generatePdfSummary(resp);
      console.log("PDF Summary:", summary);
      toast.success("PDF summary generated successfully!", {
        id: summaryToastId,
      });
      const { data, message } = summary;

      if (data) {
        toast.loading("Saving summary to database...", {
          id: "saveSummary",
        });

        if (data.summary) {
          // save it to databse or handle it as needed
          let storeResult = await storePdfSummary({
            fileName: resp[0].serverData.fileName,
            fileUrl: resp[0].serverData.fileUrl,
            title: data.title,
            summary: data.summary,
          });

          console.log("Store result:", storeResult);
          console.log("Store result data:", storeResult.data);
          console.log("Data keys:", Object.keys(storeResult.data || {}));
          console.log("Data stringified:", JSON.stringify(storeResult.data));
          console.log("Store result ID:", storeResult.data?.id);

          toast.success("PDF summary stored successfully!", {
            id: "saveSummary",
          });
          setSelectedFile(null);
          if (fileInputRef.current) {
            setIsUploading(false);
            fileInputRef.current.value = ""; // Reset file input
          }

          // Redirect to the summary page or handle it as needed
          router.push(`/summaries/${storeResult.data?.id}`);
        }
      }
    } catch (error) {
      console.error("Error generating PDF summary:", error);
      toast.error("Failed to generate PDF summary. Please try again.", {
        id: summaryToastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="w-full mx-auto" onSubmit={handleSubmit}>
      <label
        htmlFor="file"
        className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-rose-300 rounded-xl py-10 bg-rose-50 hover:bg-rose-100 transition-colors"
      >
        <UploadCloud size={40} className="text-rose-400 mb-2" />
        <span className="text-rose-500 font-medium">Choose PDF</span>
        <Input
          id="file"
          type="file"
          name="file"
          accept="application/pdf"
          required
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </label>
      {selectedFile && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
          <div>
            <span className="font-semibold">File:</span> {selectedFile.name}
          </div>
          <div>
            <span className="font-semibold">Size:</span>{" "}
            {(selectedFile.size / 1024).toFixed(2)} KB
          </div>
        </div>
      )}
      <div className="mt-4">
        <Button
          type="submit"
          className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition-colors"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <Loader2 className="animate-spin text-center" size={16} />
          ) : (
            "Upload your PDF"
          )}
        </Button>
      </div>
    </form>
  );
}

export default UploadPDFForm;
