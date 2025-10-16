"use client";
import { Loader2, UploadCloud } from "lucide-react";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/uploadActions";
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

    try {
      // Upload the file using UploadThing
      const resp = await startUpload([file]);

      console.log("Upload response:", resp);
      console.log("Upload response type:", typeof resp);
      console.log("Upload response[0]:", resp?.[0]);
      console.log("Available keys:", resp?.[0] ? Object.keys(resp[0]) : "none");

      if (!resp || resp.length === 0) {
        toast.error("Upload failed. Please try again.");
        setIsUploading(false);
        return;
      }

      // UploadThing v7+ uses serverData, older versions may use different structure
      const uploadData = resp[0] as any;

      // Try to extract serverData from various possible locations
      let extractedData = uploadData.serverData || uploadData;

      // UploadThing might return data with different property names
      const fileUrl =
        extractedData.fileUrl || extractedData.url || uploadData.url;
      const fileName =
        extractedData.fileName || extractedData.name || uploadData.name;
      const userId = extractedData.userId || uploadData.userId;

      console.log("Extracted data:", { fileUrl, fileName, userId });
      console.log("Full uploadData:", uploadData);
      console.log("Extracted serverData:", extractedData);

      // Validate required fields
      if (!fileUrl || !fileName) {
        console.error("Invalid server data structure:", {
          uploadData,
          extractedData,
          extractedFileUrl: fileUrl,
          extractedFileName: fileName,
        });
        toast.error("Upload completed but required data is missing.");
        setIsUploading(false);
        return;
      }

      // Create normalized serverData object for use below
      const serverData = { fileUrl, fileName, userId };

      const summaryToastId = toast.loading("Generating PDF summary...", {
        id: "summary",
      });

      try {
        // Pass normalized data structure to generatePdfSummary
        const normalizedResponse = [{ serverData }];
        const summary = await generatePdfSummary(normalizedResponse);
        console.log("PDF Summary:", summary);

        if (!summary.success) {
          toast.error(summary.message || "Failed to generate summary", {
            id: summaryToastId,
          });
          return;
        }

        toast.success("PDF summary generated successfully!", {
          id: summaryToastId,
        });

        const { data } = summary;

        if (data && data.summary) {
          // Prepare data for the summary page (no database storage)
          const summaryData = {
            title: data.title,
            summary: data.summary,
            parsedContent: data.parsedContent || "", // Include parsed PDF text
            fileName: serverData.fileName,
            fileUrl: serverData.fileUrl,
            createdAt: new Date().toISOString(),
          };

          // Store in sessionStorage for the summary page
          sessionStorage.setItem("currentSummary", JSON.stringify(summaryData));

          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
          }

          // Encode data and pass via URL
          const encodedData = encodeURIComponent(JSON.stringify(summaryData));

          toast.success("Redirecting to summary...", {
            id: "saveSummary",
          });

          // Redirect to the summary display page
          router.push(`/summary?data=${encodedData}`);
        } else {
          toast.error("No summary data generated", { id: summaryToastId });
        }
      } catch (error) {
        console.error("Error generating PDF summary:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to generate PDF summary. Please try again.",
          { id: summaryToastId }
        );
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again."
      );
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
