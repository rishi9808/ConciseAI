// Database removed - app now works without database
// Summaries are displayed directly without persistence

export async function getSummaries(userId: string) {
  // No database - return empty array
  // Summaries are generated on-demand and displayed directly without storage
  console.log("getSummaries called for user:", userId);
  return [];
}

export async function getSummaryById(id: string) {
  // No database - return null
  // Summaries are generated on-demand and displayed directly without storage
  console.log("getSummaryById called for id:", id);
  return null;
}

// word count function
export function getWordCount(text: string): number {
  if (!text) return 0;

  // Remove extra whitespace and split by spaces
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

// reading time function
export function getReadingTime(text: string): number {
  const wordsPerMinute = 160; // Average reading speed
  const wordCount = getWordCount(text);
  return Math.ceil(wordCount / wordsPerMinute);
}
