import BgGradient from "@/components/common/BgGradient";
import { Button } from "@/components/ui/button";
import { FileX, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  // Database removed - summaries are not stored
  // Always show "not found" message and redirect to upload
  const summary = null;

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

  // Database removed - this route is no longer functional
  // Summaries are displayed on /summary page directly without storage
  // This will never execute since summary is always null
  return null;
}
