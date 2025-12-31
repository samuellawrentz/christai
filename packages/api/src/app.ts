import type { APIResponse } from "@christianai/shared/types/api/response";
import { cors } from "@elysiajs/cors";
import { logger } from "@tqman/nice-logger";
import { Elysia, ElysiaCustomStatusResponse } from "elysia";
import { chats } from "./controllers/chats";
import { conversations } from "./controllers/conversations";
import { figures } from "./controllers/figures";
import { root as openRoutes } from "./controllers/root";
import { users } from "./controllers/users";
import { authPlugin } from "./libs/auth";

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
  })
  .use(openRoutes)
  .use(figures)
  .use(users)
  .use(conversations)
  .use(chats);
