"use server";

import { generatePdfSummaryFromGeminiAi } from "@/lib/geminiAi";
import { fetchAndExtractPdfText } from "@/lib/langChain";
// Removed database imports - no longer storing in database

// Removed pdfSummaryType interface - no longer storing in database

export async function generatePdfSummary(
  uploadResponse: Array<{
    serverData?: { fileName: string; fileUrl: string; userId: string };
    fileName?: string;
    fileUrl?: string;
    userId?: string;
  }>
) {
  if (!uploadResponse || uploadResponse.length === 0) {
    return {
      success: false,
      message: "No upload response provided.",
      data: null,
    };
  }

  // Handle both old and new UploadThing response formats
  const uploadData = uploadResponse[0];
  const serverData = uploadData?.serverData || uploadData;

  if (!serverData) {
    return {
      success: false,
      message: "Invalid upload response: missing data.",
      data: null,
    };
  }

  const { userId, fileName, fileUrl } = serverData;

  if (!fileUrl) {
    return {
      success: false,
      message: "Invalid upload response: missing file URL.",
      data: null,
    };
  }

  if (!fileName) {
    return {
      success: false,
      message: "Invalid upload response: missing file name.",
      data: null,
    };
  }

  try {
    console.log("Fetching and extracting PDF text from:", fileUrl);
    const pdfText = await fetchAndExtractPdfText(fileUrl);

    if (!pdfText || pdfText.trim().length === 0) {
      return {
        success: false,
        message:
          "Could not extract text from PDF. The file might be empty or corrupted.",
        data: null,
      };
    }

    let summary;
    try {
      console.log("Generating summary with Gemini AI...");
      summary = await generatePdfSummaryFromGeminiAi(pdfText);
      console.log("Generated summary:", summary);
    } catch (error) {
      console.error("Gemini API failed", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? `Failed to generate summary: ${error.message}`
            : "Failed to generate summary with Gemini AI. Please try again later.",
        data: null,
      };
    }

    if (!summary || summary.trim().length === 0) {
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
        parsedContent: pdfText, // Include the raw extracted PDF text
      },
    };
  } catch (error) {
    console.error("Error generating PDF summary:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate PDF summary.",
      data: null,
    };
  }
}

// Database storage functions removed - app now works without database
// PDF summaries are displayed directly without persistence
