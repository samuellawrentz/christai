import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const MODEL = "openai/gpt-oss-20b";
const MAX_TITLE_LENGTH = 50;

/**
 * Generates a concise title for a conversation based on the first exchange
 * @param userMessage - The first user message
 * @param assistantResponse - The first assistant response
 * @returns A conversation title (max 50 chars, ~6 words)
 */
export async function generateConversationTitle(
  userMessage: string,
  assistantResponse: string,
): Promise<string> {
  try {
    console.log("[Title Gen] Input - User:", userMessage.slice(0, 100));
    console.log("[Title Gen] Input - Assistant:", assistantResponse.slice(0, 100));

    const prompt = `Generate a short, descriptive title (maximum 6 words) for this conversation:

User: ${userMessage}
Assistant: ${assistantResponse}

Return only the title, no quotes or extra text.`;

    const { text: title } = await generateText({
      model: openrouter.chat(MODEL),
      prompt,
      maxOutputTokens: 20,
      temperature: 0.3,
    });

    console.log("[Title Gen] Raw AI response:", title);

    // Clean and truncate title
    const cleanTitle = title
      .trim()
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .slice(0, MAX_TITLE_LENGTH);

    console.log("[Title Gen] Clean title:", cleanTitle);

    const finalTitle = cleanTitle || getFallbackTitle(userMessage);
    console.log("[Title Gen] Final title:", finalTitle);

    return finalTitle;
  } catch (error) {
    console.error("[Title Gen] Error:", error);
    return getFallbackTitle(userMessage);
  }
}

/**
 * Fallback title: truncated first user message
 */
function getFallbackTitle(userMessage: string): string {
  const truncated = userMessage.slice(0, MAX_TITLE_LENGTH - 3);
  return truncated.length < userMessage.length ? `${truncated}...` : truncated;
}
