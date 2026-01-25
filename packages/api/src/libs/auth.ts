import { createClient } from "@supabase/supabase-js";
import type Elysia from "elysia";
import { log } from "./logger";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY",
  );
}

export const authPlugin = (app: Elysia) => {
  return app.derive(async ({ request, set }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      log.auth.warn("Missing auth header", { path: request.url });
      set.status = 401;
      throw new Error("Unauthorized: Missing or invalid authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    // Create user-specific Supabase client with auth token
    // This enables RLS policies to work with auth.uid()
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify token is valid
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      log.auth.warn("Invalid token", { error: error?.message });
      set.status = 401;
      throw new Error("Unauthorized: Invalid token");
    }

    log.auth.debug("Auth success", { userId: user.id });
    return { supabase, userId: user.id };
  });
};
