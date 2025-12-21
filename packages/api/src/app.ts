import { cors } from "@elysiajs/cors";
import { logger } from "@tqman/nice-logger";
import { Elysia, ElysiaCustomStatusResponse } from "elysia";
import { supabasePlugin } from "./libs/supabase";

export const app = new Elysia()
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
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .onRequest(({ set }) => {
    set.headers["x-request-id"] = crypto.randomUUID();
  })
  .get("/api/health", () => ({ status: "ok" }))
  .use(supabasePlugin)
  .post("/api/waitlist", async ({ supabase, body }) => {
    const { email, source } = body as { email?: string; source?: string };

    if (!email || typeof email !== "string") {
      throw new Error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.toLowerCase().trim(), source });

    if (error && !error.message.includes("duplicate")) {
      throw new Error("Failed to join waitlist");
    }

    return { success: true };
  })
  .onAfterHandle(({ responseValue, status }) => {
    if (responseValue instanceof ElysiaCustomStatusResponse && responseValue.code >= 400)
      return status(401);

    return {
      success: true,
      data: responseValue ?? null,
      error: null,
      message: "Success",
      timestamp: new Date().toISOString(),
    };
  })
  .onError(({ error }) => {
    const errorMessage = error instanceof Error ? error.message : error.toString();
    return {
      success: false,
      data: null,
      error: errorMessage,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };
  });
