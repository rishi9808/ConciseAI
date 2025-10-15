"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Database removed - app now works without database
export async function deleteSummary({ summaryId }: { summaryId: string }) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // No database - summaries are not stored
    // This function is kept for compatibility but does nothing
    console.log("deleteSummary called for id:", summaryId);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting summary:", error);
    throw new Error("Failed to delete summary");
  }
}
