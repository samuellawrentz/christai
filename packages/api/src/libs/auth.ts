import { createClient } from "@supabase/supabase-js";
import type Elysia from "elysia";

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
      set.status = 401;
      throw new Error("Unauthorized: Invalid token");
    }

    return { supabase, userId: user.id };
  });
};
