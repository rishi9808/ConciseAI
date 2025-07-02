import prisma from "./prisma";

export async function getSummaries(userId: string) {
  try {
    const summaries = await prisma.pdfSummary.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return summaries;
  } catch (error) {
    console.error("Error fetching summaries:", error);
    throw new Error("Failed to fetch summaries");
  }
}

export async function getSummaryById(id: string) {
  try {
    const summary = await prisma.pdfSummary.findUnique({
      where: {
        id: id,
      },
    });

    return summary;
  } catch (error) {
    console.error("Error fetching summary by ID:", error);
    return null;
  }
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
