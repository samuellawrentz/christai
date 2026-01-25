import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { log } from "../libs/logger";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

// Use a fast, reliable model for title generation
const TITLE_MODEL = "openai/gpt-4o-mini";
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
    const prompt = `Generate a short, descriptive title (maximum 6 words) for this conversation:

User: ${userMessage}
Assistant: ${assistantResponse}

Return only the title, no quotes or extra text.`;

    const { text: title } = await generateText({
      model: openrouter.chat(TITLE_MODEL),
      prompt,
      maxOutputTokens: 50,
      temperature: 0.5,
    });

    // Clean and truncate title
    const cleanTitle = title
      .trim()
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .slice(0, MAX_TITLE_LENGTH);

    return cleanTitle || getFallbackTitle(userMessage);
  } catch (error) {
    log.chat.error("Title generation failed", { error: String(error) });
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
