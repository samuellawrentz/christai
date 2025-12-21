import { createClient } from "@supabase/supabase-js";
import type Elysia from "elysia";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY",
  );
}

export const supabasePlugin = (app: Elysia) => {
  return app.derive(() => {
    // Use anon key so RLS policies are enforced
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    return { supabase };
  });
};
