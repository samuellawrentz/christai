import type { APIResponse } from "@christianai/shared/types/api/response";
import { cors } from "@elysiajs/cors";
import { logger } from "@tqman/nice-logger";
import { Elysia, ElysiaCustomStatusResponse } from "elysia";
import { conversations } from "./controllers/conversations";
import { figures } from "./controllers/figures";
import { root } from "./controllers/root";
import { users } from "./controllers/users";
import { supabasePlugin } from "./libs/supabase";

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
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }),
    )
    .onRequest(({ set }) => {
      set.headers["x-request-id"] = crypto.randomUUID();
    })
    .get("/health", () => ({ status: "ok" }))
    .use(supabasePlugin);
};

export const app = createApp()
  .use(root)
  .use(figures)
  .use(users)
  .use(conversations)
  .onAfterHandle(({ responseValue, status }) => {
    if (responseValue instanceof ElysiaCustomStatusResponse && responseValue.code >= 400)
      return status(401);

    const response: APIResponse = {
      success: true,
      data: responseValue ?? null,
      error: null,
      message: "Success",
      timestamp: new Date().toISOString(),
    };

    return response;
  })
  .onError(({ error }) => {
    const errorMessage = error instanceof Error ? error.message : error.toString();
    const response: APIResponse = {
      success: false,
      data: null,
      error: errorMessage,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    return response;
  });
