"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FileText, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface ParsedContentViewerProps {
  content: string;
  fileName?: string;
}

export default function ParsedContentViewer({
  content,
  fileName,
}: ParsedContentViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = content.trim().split(/\s+/).length;
  const charCount = content.length;
  const lineCount = content.split("\n").length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
      <CardHeader className="pb-3 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-blue-900">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Parsed PDF Content</span>
          </CardTitle>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Expand
              </>
            )}
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-3 sm:gap-6 mt-3 text-xs sm:text-sm text-blue-700 font-medium">
          <span className="flex items-center gap-1">
            📄 {lineCount.toLocaleString()} lines
          </span>
          <span className="flex items-center gap-1">
            📝 {wordCount.toLocaleString()} words
          </span>
          <span className="flex items-center gap-1">
            🔤 {charCount.toLocaleString()} characters
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {!isExpanded ? (
          // Preview Mode
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              This is the raw text extracted from your PDF. Click "Expand" to
              view the full content.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-40 overflow-hidden relative">
              <pre className="text-xs sm:text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">
                {content.substring(0, 300)}...
              </pre>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </div>
            <p className="text-xs text-gray-500 italic text-center">
              Preview showing first 300 characters
            </p>
          </div>
        ) : (
          // Full Content Mode
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-blue-200">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy All
                  </>
                )}
              </Button>
              {fileName && (
                <span className="flex items-center text-xs text-gray-600 px-3 py-1 bg-gray-100 rounded">
                  📎 {fileName}
                </span>
              )}
            </div>

            {/* Full Content Display */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 sm:p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
              <pre className="text-xs sm:text-sm text-gray-800 font-mono whitespace-pre-wrap break-words leading-relaxed">
                {content}
              </pre>
            </div>

            {/* Info Footer */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <span className="flex items-center gap-1">
                ℹ️ This is the raw text extracted from the PDF
              </span>
              <span className="flex items-center gap-1">
                💡 The AI summary above is based on this content
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </Card>
  );
}
