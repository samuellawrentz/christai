import type { AppType } from "../app";

export const users = (app: AppType) => {
  return app
    .get("/users/me", async ({ supabase, headers }) => {
      const authHeader = headers.authorization;
      if (!authHeader) {
        throw new Error("Authorization header required");
      }

      // Get user from auth
      const { data: authUser, error: authError } = await supabase.auth.getUser(
        authHeader.replace("Bearer ", ""),
      );

      if (authError || !authUser.user) {
        throw new Error("Invalid authentication");
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.user.id)
        .single();

      if (profileError) {
        throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      }

      return profile;
    })
    .patch("/users/me", async ({ supabase, headers, body }) => {
      const authHeader = headers.authorization;
      if (!authHeader) {
        throw new Error("Authorization header required");
      }

      // Get user from auth
      const { data: authUser, error: authError } = await supabase.auth.getUser(
        authHeader.replace("Bearer ", ""),
      );

      if (authError || !authUser.user) {
        throw new Error("Invalid authentication");
      }

      // Update user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .update(body)
        .eq("id", authUser.user.id)
        .select()
        .single();

      if (profileError) {
        throw new Error(`Failed to update user profile: ${profileError.message}`);
      }

      return profile;
    });
};
