"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

const parseSummaryContent = (summary: string) => {
  if (!summary) return [];

  const sections = [];
  const lines = summary.split("\n");
  let currentSection = { title: "", content: "", type: "content", emoji: "📝" };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for headers (# ## ###)
    if (line.startsWith("#")) {
      // Save previous section if it has content
      if (currentSection.title || currentSection.content.trim()) {
        sections.push({
          ...currentSection,
          content: currentSection.content.trim(),
        });
      }

      // Extract header level
      const headerLevel = (line.match(/^#+/) || ["#"])[0].length;

      // Extract emoji from the line (keep it in title)
      const emoji =
        line.match(
          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
        )?.[0] || "📝";

      // Clean title but keep emoji visible
      const cleanTitle = line
        .replace(/^#+\s*/, "") // Remove # symbols
        .trim();

      // Create new section
      currentSection = {
        title: cleanTitle,
        content: "",
        type: headerLevel === 1 ? "main" : headerLevel === 2 ? "sub" : "sub2",
        emoji: emoji,
      };
    }
    // If it's not a header and we have content, add to current section
    else if (line) {
      currentSection.content += line + "\n";
    }
    // Empty lines - preserve them in content
    else {
      currentSection.content += "\n";
    }
  }

  // Add the last section
  if (currentSection.title || currentSection.content.trim()) {
    sections.push({
      ...currentSection,
      content: currentSection.content.trim(),
    });
  }

  return sections.filter((section) => section.title || section.content);
};

// Helper function to parse content into lists and paragraphs
const parseContent = (content: string) => {
  if (!content) return [];

  const items = [];
  const lines = content.split("\n");
  let currentParagraph = "";

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if it's a list item
    if (trimmedLine.match(/^[🚀💡📌⭐🔷✅•\-\*]\s/)) {
      // Save current paragraph if exists
      if (currentParagraph.trim()) {
        const cleanParagraph = currentParagraph
          .trim()
          .replace(/\*\*/g, "") // Remove double asterisks
          .replace(/\*/g, ""); // Remove single asterisks
        items.push({ type: "paragraph", content: cleanParagraph });
        currentParagraph = "";
      }

      // Extract emoji and clean content
      const emoji = trimmedLine.match(/^[🚀💡📌⭐🔷✅]/)?.[0] || "•";
      const cleanContent = trimmedLine
        .replace(/^[🚀💡📌⭐🔷✅•\-\*]\s*/, "")
        .replace(/\*\*/g, "") // Remove double asterisks
        .replace(/\*/g, ""); // Remove single asterisks

      items.push({
        type: "listItem",
        content: cleanContent,
        emoji: emoji,
      });
    } else if (trimmedLine) {
      currentParagraph += line + "\n";
    } else {
      currentParagraph += "\n";
    }
  }

  // Add remaining paragraph
  if (currentParagraph.trim()) {
    const cleanParagraph = currentParagraph
      .trim()
      .replace(/\*\*/g, "") // Remove double asterisks
      .replace(/\*/g, ""); // Remove single asterisks
    items.push({ type: "paragraph", content: cleanParagraph });
  }

  return items;
};

// Simplified Progress Bar (Only progress bar, no text or pills)
const ProgressBar = ({
  sections,
  currentIndex,
}: {
  sections: any[];
  currentIndex: number;
}) => {
  const progressPercentage = ((currentIndex + 1) / sections.length) * 100;

  return (
    <div className="mb-4 sm:mb-6 p-2 sm:p-4 bg-gradient-to-r from-rose-50 to-rose-100 rounded-lg border border-rose-200 shadow-sm">
      {/* Progress Bar Only */}
      <div className="relative">
        <div className="w-full bg-rose-200 rounded-full h-2 sm:h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-500 to-rose-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Bottom Navigation Component
const BottomNavigation = ({
  currentIndex,
  totalSections,
  onPrevious,
  onNext,
  sections,
}: {
  currentIndex: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  sections: any[];
}) => {
  return (
    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 p-3 sm:p-4 bg-gradient-to-r from-rose-50 to-rose-100 rounded-lg border border-rose-200 shadow-sm">
      {/* Previous Button */}
      <Button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto ${
          currentIndex === 0
            ? "bg-rose-200 text-rose-400 cursor-not-allowed"
            : "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg transform hover:scale-105 active:scale-95"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* Center Progress Dots */}
      <div className="flex items-center gap-1 sm:gap-2 order-first sm:order-none">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-2 h-2 sm:w-3 sm:h-3 bg-rose-500 shadow-md"
                : index < currentIndex
                ? "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-400"
                : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-200"
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={currentIndex === totalSections - 1}
        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto ${
          currentIndex === totalSections - 1
            ? "bg-rose-200 text-rose-400 cursor-not-allowed"
            : "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg transform hover:scale-105 active:scale-95"
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default function SummaryViewer({ summary }: { summary: string }) {
  const sections = parseSummaryContent(summary);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSectionIndex((prev) => Math.min(sections.length - 1, prev + 1));
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (sections.length === 0) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No Summary Content
          </h3>
          <p className="text-gray-500">
            The summary content is not available or could not be parsed.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const contentItems = parseContent(currentSection.content);

  return (
    <div className="space-y-4 sm:space-y-6 sm:px-0">
      {/* Simplified Progress Bar */}
      <ProgressBar sections={sections} currentIndex={currentSectionIndex} />

      {/* Current Section */}
      <Card
        className={`border transition-all duration-500 hover:shadow-lg min-h-[400px] w-full mx-auto sm:min-h-[500px] ${
          currentSection.type === "main"
            ? "border-rose-200 bg-gradient-to-br from-rose-50 to-white"
            : currentSection.type === "sub"
            ? "border-rose-300 bg-gradient-to-br from-rose-100 to-white"
            : "border-rose-200 bg-white"
        }`}
      >
        {currentSection.title && (
          <CardHeader className="pb-3 sm:pb-4 border-b border-rose-100 px-4 sm:px-6">
            <CardTitle className="flex items-start sm:items-center gap-3 text-xl sm:text-2xl font-bold text-rose-800 leading-tight">
              <span className="text-2xl sm:text-3xl flex-shrink-0">
                {currentSection.emoji}
              </span>
              <span className="break-words">{currentSection.title}</span>
            </CardTitle>
          </CardHeader>
        )}

        <CardContent
          className={`${
            currentSection.title ? "pt-4 sm:pt-6" : "pt-4 sm:pt-6"
          } px-4 sm:px-6`}
        >
          <div className="h-[300px] sm:h-[400px] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-rose-100">
            {contentItems.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {contentItems.map((item, idx) => (
                  <div key={idx} className="animate-in fade-in duration-300">
                    {item.type === "listItem" ? (
                      <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-rose-50/50 border border-rose-200 hover:bg-rose-100/50 transition-all">
                        <span className="text-lg sm:text-xl flex-shrink-0 mt-0.5">
                          {item.emoji}
                        </span>
                        <div className="text-gray-700 leading-relaxed w-full text-base sm:text-lg break-words">
                          {item.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-700 leading-relaxed w-full break-words p-2 text-base sm:text-lg">
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              currentSection.content && (
                <div className="text-gray-700 leading-relaxed w-full break-words p-2 animate-in fade-in duration-300 text-base sm:text-lg">
                  {currentSection.content}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentIndex={currentSectionIndex}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        sections={sections}
      />
    </div>
  );
}
