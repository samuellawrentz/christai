import type { AppType } from "../app";
import type { UserResponse } from "../../../shared/src/types/api/models";

export const users = (app: AppType) => {
  return app
    .get("/users/me", async ({ supabase, headers }): Promise<UserResponse> => {
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

      return {
        success: true,
        data: profile,
        error: null,
        message: "User profile retrieved successfully",
        timestamp: new Date().toISOString(),
      };
    })
    .patch("/users/me", async ({ supabase, headers, body }): Promise<UserResponse> => {
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

      return {
        success: true,
        data: profile,
        error: null,
        message: "User profile updated successfully",
        timestamp: new Date().toISOString(),
      };
    });
};
