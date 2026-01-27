import type { APIResponse } from "@christianai/shared/types/api/response";
import { cors } from "@elysiajs/cors";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@tqman/nice-logger";
import { Elysia, ElysiaCustomStatusResponse } from "elysia";
import { chats } from "./controllers/chats";
import { conversations } from "./controllers/conversations";
import { figures } from "./controllers/figures";
import { root as openRoutes } from "./controllers/root";
import { users } from "./controllers/users";
import { authPlugin } from "./libs/auth";
import { log } from "./libs/logger";

// Public Supabase client (anon key, no auth)
const publicSupabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || "",
);

export type AppType = ReturnType<typeof createApp>;

const createApp = () => {
  return new Elysia()
    .use(
      logger({
        withTimestamp: true,
      }),
    )
    .use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://christianai.world",
          "https://www.christianai.world",
          "https://app.christianai.world",
          "http://localhost:8081",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }),
    )
    .onRequest(({ set }) => {
      set.headers["x-request-id"] = crypto.randomUUID();
    })
    .get("/health", () => ({ status: "ok" }))
    .get("/public/share/:token", async ({ params }) => {
      // Fetch share with nested conversation, figure, and messages
      const { data: share, error: shareError } = await publicSupabase
        .from("conversation_shares")
        .select(`
          share_token,
          is_active,
          conversations (
            id,
            title,
            created_at,
            figures (
              id,
              display_name,
              avatar_url,
              slug
            )
          )
        `)
        .eq("share_token", params.token)
        .eq("is_active", true)
        .single();

      if (shareError || !share) {
        throw new Error("Share not found or inactive");
      }

      // Fetch messages for the conversation
      // conversation_shares.conversation_id -> conversations (single object relation)
      const conversation = share.conversations as unknown as { id: string } | null;
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const { data: messages, error: messagesError } = await publicSupabase
        .from("messages")
        .select("id, role, content, timestamp")
        .eq("conversation_id", conversation.id)
        .order("timestamp", { ascending: true });

      if (messagesError) {
        throw new Error(`Failed to fetch messages: ${messagesError.message}`);
      }

      return {
        ...share,
        messages,
      };
    })
    .use(authPlugin);
};

export const app = createApp()
  .onAfterHandle(({ responseValue, status }) => {
    if (responseValue instanceof ElysiaCustomStatusResponse && responseValue.code >= 400)
      return status(401);

    // Bypass wrapper for Response objects (includes streams, redirects, etc.)
    if (responseValue instanceof Response) return responseValue;

    const response: APIResponse = {
      success: true,
      data: responseValue ?? null,
      error: null,
      message: "Success",
      timestamp: new Date().toISOString(),
    };

    return response;
  })
  .onError(({ error, path, request }) => {
    const errorMessage = error instanceof Error ? error.message : error.toString();
    log.api.error("Request failed", {
      path,
      method: request.method,
      error: errorMessage,
      stack: error instanceof Error ? error.stack?.split("\n").slice(0, 3).join(" ") : undefined,
    });

    const response: APIResponse = {
      success: false,
      data: null,
      error: errorMessage,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    return response;
  })
  .use(openRoutes)
  .use(figures)
  .use(users)
  .use(conversations)
  .use(chats);
