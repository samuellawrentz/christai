import { createClient } from "@supabase/supabase-js";
import { Elysia } from "elysia";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY",
  );
}

// Create supabase client for auth validation
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const authPlugin = new Elysia().derive(async ({ request, set }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    set.status = 401;
    throw new Error("Unauthorized: Missing or invalid authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    set.status = 401;
    throw new Error("Unauthorized: Invalid token");
  }

  return { userId: user.id };
});
