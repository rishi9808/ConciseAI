"use client";
import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

export default function DownloadSummaryButton({
  title,
  summaryText,
  fileName,
  createdAt,
}: {
  title?: string;
  summaryText?: string;
  fileName?: string;
  createdAt?: Date;
}) {
  const handleDownload = () => {
    const summaryContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                               📄 ConciseAI AI SUMMARY
                                   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


📋 DOCUMENT TITLE: ${title || "Untitled Document"}

📅 GENERATED ON: ${createdAt?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at ${createdAt?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}

📁 SOURCE FILE: ${fileName || "Unknown"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                                   📖 SUMMARY CONTENT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${summaryText || "No summary content available."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                                   📊 DOCUMENT STATS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Word Count: ${
      summaryText
        ?.trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length || 0
    } words
• Character Count: ${summaryText?.length || 0} characters
• Reading Time: ~${Math.ceil(
      (summaryText
        ?.trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length || 0) / 200
    )} minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                              🤖 Powered by ConciseAI
                        Transform your PDFs into actionable insights
                           
                                Generated with ❤️ by AI
                                
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const blob = new Blob([summaryContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `summary-${title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <Button
      size={"sm"}
      className="h-8 px-3 bg-rose-100 text-red-600 hover:text-red-700 hover:bg-rose-50"
      onClick={handleDownload}
    >
      <Download className="h-4 w-4 mr-1" />
      Download Summary
    </Button>
  );
}
