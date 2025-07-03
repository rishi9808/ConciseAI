"use server";

import { generatePdfSummaryFromGeminiAi } from "@/lib/geminiAi";
import { fetchAndExtractPdfText } from "@/lib/langChain";
import { generatePdfSummaryFromOpenAI } from "@/lib/openAi";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface pdfSummaryType {
  userId?: string;
  title: string;
  summary: string;
  fileName: string;
  fileUrl: string;
}

export async function generatePdfSummary(
  uploadResponse: Array<{
    serverData: { fileName: string; fileUrl: string; userId: string };
  }>
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "No upload response provided.",
      data: null,
    };
  }

  const {
    serverData: { userId, fileName, fileUrl },
  } = uploadResponse[0];

  if (!fileUrl) {
    return {
      success: false,
      message: "Invalid upload response data.",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(fileUrl);

    let summary;
    try {
      summary = await generatePdfSummaryFromGeminiAi(pdfText);
      console.log("Generated summary:", summary);
    } catch (error) {
      console.error("Gemini API failed", error);
      return {
        success: false,
        message:
          "Failed to generate summary with Gemini AI. Please try again later.",
        data: null,
      };
    }

    if (!summary) {
      return {
        success: false,
        message: "No summary generated from the PDF content.",
        data: null,
      };
    }

    const formatedFileName = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension

    return {
      success: true,
      message: "PDF summary generated successfully.",
      data: {
        title: formatedFileName,
        summary,
      },
    };
  } catch (error) {
    console.error("Error generating PDF summary:", error);
    return {
      success: false,
      message: "Failed to generate PDF summary.",
      data: null,
    };
  }
}

export async function savePdfSummary({
  fileName,
  fileUrl,
  title,
  summary,
}: pdfSummaryType) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user?.id || "default-user-id"; // Fallback for testing
    const savedSummary = await prisma.pdfSummary.create({
      data: {
        user_id: userId,
        file_name: fileName,
        original_file_url: fileUrl,
        title: title,
        summary_text: summary,
        created_at: new Date(),
      },
    });

    return {
      success: true,
      message: "PDF summary saved successfully.",
      data: savedSummary,
    };
  } catch (error: any) {
    console.error("Error saving PDF summary:", error);
    return {
      success: false,
      message: "Failed to save PDF summary.",
      data: null,
    };
  }
}

export async function storePdfSummary({
  fileName,
  fileUrl,
  title,
  summary,
}: pdfSummaryType) {
  try {
    // No need to get userId here, savePdfSummary will handle it
    const savedPdfSummary = await savePdfSummary({
      fileName,
      fileUrl,
      title,
      summary,
    });

    if (!savedPdfSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary.",
      };
    }

    // Revalidate the saved summary
    revalidatePath(`/summaries/${savedPdfSummary.data?.id}`);

    return {
      success: true,
      message: "PDF summary stored successfully.",
      data: savedPdfSummary.data,
    };
  } catch (error) {
    console.error("Error storing PDF summary:", error);
    return {
      success: false,
      message: "Failed to store PDF summary.",
    };
  }
}
