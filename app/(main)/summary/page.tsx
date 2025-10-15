"use client";
import BgGradient from "@/components/common/BgGradient";
import SourceInfo from "@/components/summaries/SourceInfo";
import SummaryHeader from "@/components/summaries/summaryHeader";
import SummaryViewer from "@/components/summaries/SummaryViewer";
import ParsedContentViewer from "@/components/summaries/ParsedContentViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MotionDiv } from "@/components/common/motion-wrapper";
import { cardVariants } from "@/utils/animations";
import { useSearchParams } from "next/navigation";

interface SummaryData {
  title: string;
  summary: string;
  parsedContent?: string; // Optional raw PDF text
  fileName: string;
  fileUrl: string;
  createdAt: string;
}

function getWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export default function SummaryDisplayPage() {
  const searchParams = useSearchParams();
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get data from URL params or sessionStorage
    const dataParam = searchParams.get("data");

    if (dataParam) {
      try {
        const decoded = decodeURIComponent(dataParam);
        const data = JSON.parse(decoded);
        setSummaryData(data);
        // Also store in sessionStorage for page refresh
        sessionStorage.setItem("currentSummary", JSON.stringify(data));
      } catch (error) {
        console.error("Error parsing summary data:", error);
        // Try to get from sessionStorage
        const stored = sessionStorage.getItem("currentSummary");
        if (stored) {
          setSummaryData(JSON.parse(stored));
        }
      }
    } else {
      // Try to get from sessionStorage
      const stored = sessionStorage.getItem("currentSummary");
      if (stored) {
        setSummaryData(JSON.parse(stored));
      }
    }

    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <BgGradient />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading summary...</p>
        </div>
      </main>
    );
  }

  if (!summaryData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <BgGradient />
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-rose-500" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              No Summary Available
            </h1>

            <p className="text-gray-600 mb-8">
              No summary data found. Please upload a PDF to generate a summary.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Link href="/upload" className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New PDF
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { title, summary, fileName, fileUrl, createdAt } = summaryData;

  return (
    <main className="min-h-screen relative isolate bg-linear-to-r from-gray-50 to-white">
      <BgGradient />
      <div className="container sm:mx-auto flex flex-col gap-4">
        <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <div className="flex flex-col">
            <SummaryHeader
              title={title || "No Title"}
              createdAt={new Date(createdAt)}
              summary={summary}
            />
          </div>

          {fileName && (
            <SourceInfo
              fileName={fileName}
              originalFileUrl={fileUrl}
              title={title || "No Title"}
              summaryText={summary}
              createdAt={new Date(createdAt)}
            />
          )}

          {/* Parsed PDF Content Section */}
          {summaryData.parsedContent && (
            <div className="relative mt-4 sm:mt-8 lg:mt-16 max-w-4xl mx-auto">
              <ParsedContentViewer content={summaryData.parsedContent} />
            </div>
          )}

          <div className="relative mt-8">
            <div className="relative px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover-shadow-2xl hover:bg-white/90 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-rose-50/50 via-orange-50/30 to-transparent opacity-50 rounded-2xl sm:rounded-3xl" />

              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
                {getWordCount(summary)} words
              </div>

              <MotionDiv
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative my-12 sm:my-12 flex justify-center"
              >
                <SummaryViewer summary={summary} />
              </MotionDiv>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto px-4">
            <Button
              asChild
              variant="outline"
              className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300"
            >
              <Link href="/upload" className="flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload Another PDF
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
