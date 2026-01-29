import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { stepCountIs, streamText } from "ai";
import { t } from "elysia";
import type { AppType } from "../app";
import { log } from "../libs/logger";
import { buildSystemPrompt } from "../services/prompt-builder";
import { generateConversationTitle } from "../services/title-generator";
import { createBibleTools } from "../tools";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const MODEL = "openai/gpt-oss-120b";
const MESSAGE_HISTORY_LIMIT = 10;

export const chats = (app: AppType) => {
  return app.post(
    "/chats/converse",
    async ({ supabase, userId, body }) => {
      const { conversationId, message } = body;
      const startTime = Date.now();
      log.chat.info("Conversation started", {
        conversationId,
        userId,
        messageLength: message.length,
      });

      // RLS automatically filters by auth.uid()
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("id, figure_id, title")
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

      // Fetch user preferences
      const { data: userData } = await supabase
        .from("users")
        .select("preferences")
        .eq("id", userId)
        .single();

      const userPreferences = userData?.preferences || {};

      // Create Bible tools with user's preferred translation
      const bibleTools = createBibleTools(userData?.preferences?.bible_translation);

      // Build complete system prompt
      const systemPrompt = buildSystemPrompt(
        figure.slug,
        figure.display_name,
        figure.description || "",
        userPreferences,
      );

      // Fetch conversation history
      const { data: history } = await supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("timestamp", { ascending: true })
        .limit(MESSAGE_HISTORY_LIMIT);

      // Save user message to database (trigger auto-updates conversation metadata)
      const { error: userMsgError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        user_id: userId,
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      });

      if (userMsgError) {
        log.chat.error("Failed to save user message", {
          conversationId,
          error: userMsgError.message,
        });
        throw new Error("Failed to save message");
      }

      // Build messages array for AI
      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...(history || []).map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: message },
      ];

      log.chat.debug("Streaming AI response", {
        model: MODEL,
        historyLength: history?.length || 0,
        figure: figure.slug,
      });

      // Stream AI response
      const result = streamText({
        model: openrouter.chat(MODEL),
        messages,
        tools: bibleTools,
        stopWhen: stepCountIs(3), // Allow up to 3 steps (tool calls + final response)
        temperature: 0.8,
        maxOutputTokens: 1000,
        onStepFinish({ toolCalls, toolResults }) {
          if (toolCalls && toolCalls.length > 0) {
            for (const call of toolCalls) {
              log.chat.info("Tool call executed", {
                conversationId,
                tool: call.toolName,
              });
            }
          }
          if (toolResults && toolResults.length > 0) {
            log.chat.debug("Tool results received", {
              conversationId,
              resultCount: toolResults.length,
            });
          }
        },
        async onFinish({ text, usage, steps }) {
          const durationMs = Date.now() - startTime;
          const toolCallCount = steps.filter((s) => s.toolCalls && s.toolCalls.length > 0).length;

          log.chat.info("Conversation completed", {
            conversationId,
            durationMs,
            tokens: usage?.totalTokens,
            toolCalls: toolCallCount,
            responseLength: text.length,
          });

          // Save assistant message with retry and exponential backoff
          const saveAssistantMessage = async (attempt = 1, maxAttempts = 3): Promise<void> => {
            const { error } = await supabase.from("messages").insert({
              conversation_id: conversationId,
              user_id: userId,
              role: "assistant",
              content: text,
              timestamp: new Date().toISOString(),
              token_count: usage?.totalTokens,
            });

            if (error) {
              log.chat.error("Failed to save assistant message", {
                conversationId,
                error: error.message,
                attempt,
                maxAttempts,
              });
              if (attempt < maxAttempts) {
                await new Promise((r) => setTimeout(r, 500 * attempt)); // Exponential backoff
                return saveAssistantMessage(attempt + 1, maxAttempts);
              }
              // All retries exhausted - log critical error
              log.chat.error("CRITICAL: Assistant message lost after all retries", {
                conversationId,
                content: text.slice(0, 100),
              });
            }
          };

          await saveAssistantMessage();

          // Generate title only for first exchange (no history exists)
          if (!conversation.title && (!history || history.length === 0)) {
            try {
              const title = await generateConversationTitle(message, text);
              await supabase.from("conversations").update({ title }).eq("id", conversationId);
              log.chat.debug("Title generated", { conversationId, title });
            } catch (error) {
              log.chat.error("Failed to generate title", { conversationId, error: String(error) });
            }
          }
        },
      });

      return result.toUIMessageStreamResponse();
    },
    {
      body: t.Object({
        conversationId: t.String({ format: "uuid" }),
        message: t.String({ minLength: 1, maxLength: 4000 }),
      }),
    },
  );
};
