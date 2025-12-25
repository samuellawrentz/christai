import fs from "node:fs";
import path from "node:path";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { t } from "elysia";
import type { AppType } from "../app";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const MODEL = "openai/gpt-oss-120b:free";
const MESSAGE_HISTORY_LIMIT = 20;

export const chats = (app: AppType) => {
  return app.post(
    "/chats/converse",
    async ({ supabase, userId, body }) => {
      const { conversationId, message, isGreeting } = body;

      // RLS automatically filters by auth.uid()
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("id, figure_id")
        .eq("id", conversationId)
        .eq("is_deleted", false)
        .single();

      if (convError || !conversation) {
        throw new Error("Conversation not found or access denied");
      }

      // Fetch figure data
      const { data: figure, error: figureError } = await supabase
        .from("figures")
        .select("id, slug, display_name, description")
        .eq("id", conversation.figure_id)
        .eq("is_active", true)
        .single();

      if (figureError || !figure) {
        throw new Error("Figure not found or inactive");
      }

      // Load system prompt from file
      const promptPath = path.join(process.cwd(), "src", "prompts", "figures", `${figure.slug}.md`);
      let systemPrompt: string;

      try {
        systemPrompt = fs.readFileSync(promptPath, "utf-8");
      } catch (_error) {
        // Fallback system prompt if file not found
        systemPrompt = `You are ${figure.display_name}. ${figure.description} Speak with wisdom and compassion.`;
      }

      // Fetch conversation history
      const { data: history } = await supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("timestamp", { ascending: true })
        .limit(MESSAGE_HISTORY_LIMIT);

      // Save user message to database (trigger auto-updates conversation metadata)
      // Skip if this is an auto-greeting trigger
      if (!isGreeting) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          user_id: userId,
          role: "user",
          content: message,
          timestamp: new Date().toISOString(),
        });
      }

      // Build messages array for AI
      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...(history || []).map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: isGreeting ? "" : message },
      ];

      // Stream AI response
      const result = streamText({
        model: openrouter.chat(MODEL),
        messages,
        temperature: 0.7,
        maxOutputTokens: isGreeting ? 300 : 1500,
        async onFinish({ text, usage }) {
          // Save assistant message (trigger auto-updates conversation metadata)
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            user_id: userId,
            role: "assistant",
            content: text,
            timestamp: new Date().toISOString(),
            token_count: usage?.totalTokens,
          });
        },
      });

      return result.toUIMessageStreamResponse();
    },
    {
      body: t.Object({
        conversationId: t.String({ format: "uuid" }),
        message: t.String({ minLength: 1, maxLength: 4000 }),
        isGreeting: t.Optional(t.Boolean()),
      }),
    },
  );
};
