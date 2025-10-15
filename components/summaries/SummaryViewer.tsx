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

// Helper function to format text with markdown-like features
const formatText = (text: string) => {
  if (!text) return text;

  // Handle bold text (**text** or __text__)
  let formatted = text.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-bold text-rose-700">$1</strong>'
  );
  formatted = formatted.replace(
    /__(.+?)__/g,
    '<strong class="font-bold text-rose-700">$1</strong>'
  );

  // Handle italic text (*text* or _text_)
  formatted = formatted.replace(
    /\*(.+?)\*/g,
    '<em class="italic text-gray-700">$1</em>'
  );
  formatted = formatted.replace(
    /_(.+?)_/g,
    '<em class="italic text-gray-700">$1</em>'
  );

  // Handle inline code (`code`)
  formatted = formatted.replace(
    /`(.+?)`/g,
    '<code class="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono text-sm">$1</code>'
  );

  // Handle links [text](url)
  formatted = formatted.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" class="text-rose-600 hover:text-rose-700 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return formatted;
};

// Helper function to parse content into lists and paragraphs
const parseContent = (content: string) => {
  if (!content) return [];

  const items = [];
  const lines = content.split("\n");
  let currentParagraph = "";

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if it's a numbered list (1. 2. etc.)
    if (trimmedLine.match(/^\d+\.\s/)) {
      // Save current paragraph if exists
      if (currentParagraph.trim()) {
        items.push({
          type: "paragraph",
          content: formatText(currentParagraph.trim()),
        });
        currentParagraph = "";
      }

      const number = trimmedLine.match(/^\d+/)?.[0];
      const cleanContent = trimmedLine.replace(/^\d+\.\s*/, "");

      items.push({
        type: "numberedItem",
        content: formatText(cleanContent),
        number: number,
      });
    }
    // Check if it's a list item with emojis or bullets
    else if (
      trimmedLine.match(/^[🚀💡📌⭐🔷✅❗️🎯🔥💎🌟✨🎉📊📈🎓🏆•\-\*]\s/)
    ) {
      // Save current paragraph if exists
      if (currentParagraph.trim()) {
        items.push({
          type: "paragraph",
          content: formatText(currentParagraph.trim()),
        });
        currentParagraph = "";
      }

      // Extract emoji and clean content
      const emoji =
        trimmedLine.match(/^[🚀💡📌⭐🔷✅❗️🎯🔥💎🌟✨🎉📊📈🎓🏆]/)?.[0] || "•";
      const cleanContent = trimmedLine.replace(
        /^[🚀💡📌⭐🔷✅❗️🎯🔥💎🌟✨🎉📊📈🎓🏆•\-\*]\s*/,
        ""
      );

      items.push({
        type: "listItem",
        content: formatText(cleanContent),
        emoji: emoji,
      });
    }
    // Check for code blocks (```)
    else if (trimmedLine.startsWith("```")) {
      if (currentParagraph.trim()) {
        items.push({
          type: "paragraph",
          content: formatText(currentParagraph.trim()),
        });
        currentParagraph = "";
      }
      // Note: Basic code block handling - could be enhanced
      items.push({
        type: "codeBlock",
        content: trimmedLine.replace(/```/g, ""),
      });
    }
    // Check for blockquotes (>)
    else if (trimmedLine.startsWith(">")) {
      if (currentParagraph.trim()) {
        items.push({
          type: "paragraph",
          content: formatText(currentParagraph.trim()),
        });
        currentParagraph = "";
      }
      const quoteContent = trimmedLine.replace(/^>\s*/, "");
      items.push({ type: "quote", content: formatText(quoteContent) });
    }
    // Check for horizontal rule (---, ***, ___)
    else if (trimmedLine.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      if (currentParagraph.trim()) {
        items.push({
          type: "paragraph",
          content: formatText(currentParagraph.trim()),
        });
        currentParagraph = "";
      }
      items.push({ type: "divider" });
    } else if (trimmedLine) {
      currentParagraph += line + "\n";
    } else {
      currentParagraph += "\n";
    }
  }

  // Add remaining paragraph
  if (currentParagraph.trim()) {
    items.push({
      type: "paragraph",
      content: formatText(currentParagraph.trim()),
    });
  }

  return items;
};

// Helper function to estimate reading time
const estimateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

// Enhanced Progress Bar with stats
const ProgressBar = ({
  sections,
  currentIndex,
  currentSection,
}: {
  sections: any[];
  currentIndex: number;
  currentSection: any;
}) => {
  const progressPercentage = ((currentIndex + 1) / sections.length) * 100;
  const readingTime = estimateReadingTime(currentSection.content);

  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-rose-50 via-orange-50 to-rose-50 rounded-xl border-2 border-rose-200 shadow-md">
      {/* Stats Row */}
      <div className="flex justify-between items-center mb-3 text-xs sm:text-sm text-rose-700 font-medium">
        <span className="flex items-center gap-1">
          ⏱️ ~{readingTime} min read
        </span>
        <span className="flex items-center gap-1">
          📄 {currentIndex + 1}/{sections.length} sections
        </span>
        <span className="hidden sm:flex items-center gap-1">
          ✨ {Math.round(progressPercentage)}% complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-rose-200 rounded-full h-2.5 sm:h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600 h-full rounded-full transition-all duration-700 ease-out shadow-lg"
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
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const handlePrevious = () => {
    setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSectionIndex((prev) => Math.min(sections.length - 1, prev + 1));
  };

  const goToSection = (index: number) => {
    setCurrentSectionIndex(index);
    setShowTableOfContents(false);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setShowTableOfContents(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (sections.length === 0) {
    return (
      <Card className="border-dashed border-gray-300 shadow-lg">
        <CardContent className="py-12 text-center">
          <div className="text-5xl mb-4 animate-bounce">📄</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Summary Content
          </h3>
          <p className="text-gray-600 mb-4">
            The summary content is not available or could not be parsed.
          </p>
          <p className="text-sm text-gray-500">
            Try uploading a different PDF or contact support if the issue
            persists.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const contentItems = parseContent(currentSection.content);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Add transition effect when changing sections
  React.useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentSectionIndex]);

  return (
    <div className="space-y-4 sm:space-y-6 sm:px-0">
      {/* Section Info and Table of Contents Toggle */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-600 font-medium">
          Section {currentSectionIndex + 1} of {sections.length}
        </div>
        <Button
          onClick={() => setShowTableOfContents(!showTableOfContents)}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm border-rose-300 text-rose-700 hover:bg-rose-50"
        >
          {showTableOfContents ? "Hide" : "Show"} Contents
        </Button>
      </div>

      {/* Table of Contents */}
      {showTableOfContents && (
        <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white animate-in fade-in slide-in-from-top duration-300">
          <CardHeader className="pb-3 border-b border-rose-200">
            <CardTitle className="text-lg font-bold text-rose-800 flex items-center gap-2">
              📑 Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => goToSection(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start gap-3 ${
                    index === currentSectionIndex
                      ? "bg-rose-500 text-white shadow-md"
                      : "bg-white hover:bg-rose-100 text-gray-700 border border-rose-100"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{section.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {section.title || "Section " + (index + 1)}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${index === currentSectionIndex ? "text-rose-100" : "text-gray-500"}`}
                    >
                      {index === currentSectionIndex
                        ? "Currently viewing"
                        : `Section ${index + 1}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Progress Bar */}
      <ProgressBar
        sections={sections}
        currentIndex={currentSectionIndex}
        currentSection={sections[currentSectionIndex]}
      />

      {/* Current Section */}
      <Card
        className={`border transition-all duration-500 hover:shadow-xl min-h-[400px] w-full mx-auto sm:min-h-[500px] ${
          currentSection.type === "main"
            ? "border-rose-300 bg-gradient-to-br from-rose-50 via-orange-50 to-white shadow-rose-100"
            : currentSection.type === "sub"
              ? "border-rose-200 bg-gradient-to-br from-rose-50 to-white shadow-rose-50"
              : "border-rose-200 bg-white"
        }`}
      >
        {currentSection.title && (
          <CardHeader className="pb-3 sm:pb-4 border-b-2 border-rose-200 px-4 sm:px-6 bg-gradient-to-r from-rose-50 to-transparent">
            <CardTitle className="flex items-start sm:items-center gap-3 text-xl sm:text-2xl lg:text-3xl font-bold text-rose-900 leading-tight">
              <span className="text-2xl sm:text-3xl lg:text-4xl flex-shrink-0 drop-shadow-sm">
                {currentSection.emoji}
              </span>
              <span className="break-words">{currentSection.title}</span>
            </CardTitle>
          </CardHeader>
        )}

        <CardContent
          className={`${
            currentSection.title ? "pt-4 sm:pt-6" : "pt-4 sm:pt-6"
          } px-4 sm:px-6 transition-opacity duration-300 ${
            isTransitioning ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="h-[300px] sm:h-[400px] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-rose-100">
            {contentItems.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {contentItems.map((item, idx) => (
                  <div key={idx} className="animate-in fade-in duration-300">
                    {item.type === "listItem" ? (
                      <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-rose-50/50 border border-rose-200 hover:bg-rose-100/50 transition-all duration-200 hover:shadow-md">
                        <span className="text-lg sm:text-xl flex-shrink-0 mt-0.5">
                          {item.emoji}
                        </span>
                        <div
                          className="text-gray-700 leading-relaxed w-full text-base sm:text-lg break-words"
                          dangerouslySetInnerHTML={{
                            __html: item.content || "",
                          }}
                        />
                      </div>
                    ) : item.type === "numberedItem" ? (
                      <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-blue-50/50 border border-blue-200 hover:bg-blue-100/50 transition-all duration-200 hover:shadow-md">
                        <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                          {item.number}
                        </span>
                        <div
                          className="text-gray-700 leading-relaxed w-full text-base sm:text-lg break-words"
                          dangerouslySetInnerHTML={{
                            __html: item.content || "",
                          }}
                        />
                      </div>
                    ) : item.type === "quote" ? (
                      <div className="border-l-4 border-rose-400 pl-4 py-2 bg-rose-50/30 rounded-r-lg">
                        <div
                          className="text-gray-600 italic leading-relaxed text-base sm:text-lg break-words"
                          dangerouslySetInnerHTML={{
                            __html: item.content || "",
                          }}
                        />
                      </div>
                    ) : item.type === "codeBlock" ? (
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-words">
                          {item.content}
                        </pre>
                      </div>
                    ) : item.type === "divider" ? (
                      <hr className="border-t-2 border-rose-200 my-4" />
                    ) : (
                      <div
                        className="text-gray-700 leading-relaxed w-full break-words p-2 text-base sm:text-lg"
                        dangerouslySetInnerHTML={{ __html: item.content || "" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              currentSection.content && (
                <div className="text-gray-700 leading-relaxed w-full break-words p-2 animate-in fade-in duration-300 text-base sm:text-lg whitespace-pre-wrap">
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

      {/* Keyboard Shortcuts Info */}
      <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 shadow-sm font-mono">
              ←
            </kbd>
            <span className="hidden sm:inline">Previous</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 shadow-sm font-mono">
              →
            </kbd>
            <span className="hidden sm:inline">Next</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 shadow-sm font-mono">
              Esc
            </kbd>
            <span className="hidden sm:inline">Close Menu</span>
          </span>
        </div>
      </div>
    </div>
  );
}
