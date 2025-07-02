import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePdfSummaryFromOpenAI(pdfText: string) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Transform the following PDF content into a concise, engaging summary using markdown formatting and relevant emojis. \n\n${pdfText}`,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No summary content received from OpenAI.");
    }
  } catch (error: any) {
    if (error?.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw error;
  }
}
