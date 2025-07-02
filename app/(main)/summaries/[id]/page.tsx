import BgGradient from "@/components/common/BgGradient";
import SourceInfo from "@/components/summaries/SourceInfo";
import SummaryHeader from "@/components/summaries/summaryHeader";
import SummaryViewer from "@/components/summaries/SummaryViewer";
import { Button } from "@/components/ui/button";
import { getSummaryById, getWordCount } from "@/lib/summaries";
import { ArrowLeft, FileText, FileX, Home, Upload } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MotionDiv } from "@/components/common/motion-wrapper";
import { cardVariants } from "@/utils/animations";

export default async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const summary = await getSummaryById(id);

  if (!summary) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <BgGradient />
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
              <FileX className="w-8 h-8 text-rose-500" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Summary Not Found
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-2">
              The PDF summary you're looking for doesn't exist or may have been
              deleted.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Summary ID:{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {id}
              </span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                variant="outline"
                className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300"
              >
                <Link href="/dashboard" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>

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

  const {
    title,
    summary_text,
    created_at,
    status,
    original_file_url,
    file_name,
  } = summary;

  // When summary exists, show the summary content
  return (
    <main className="min-h-screen relative isolate bg-linear-to-r from-gray-50 to-white">
      <BgGradient />
      <div className="container sm:mx-auto flex flex-col gap-4">
        <div className="px-0 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <div className="flex flex-col">
            <SummaryHeader
              title={title || "No Title"}
              createdAt={created_at}
              summary={summary_text}
            />
          </div>
          {file_name && (
            <SourceInfo
              fileName={file_name}
              originalFileUrl={original_file_url}
              title={title || "No Title"}
              summaryText={summary_text}
              createdAt={created_at}
            />
          )}
          <div className="relative mt-4 sm:mt-8 lg:mt-16">
            <div className="relative px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover-shadow-2xl hover:bg-white/90 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-rose-50/50 via-orange-50/30 to-transparent opacity-50 rounded-2xl sm:rounded-3xl" />

              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
                {getWordCount(summary_text)} words
              </div>

              <MotionDiv
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative my-12 sm:my-12 flex justify-center"
              >
                <SummaryViewer summary={summary_text} />
              </MotionDiv>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
