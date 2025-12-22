import type {
  ConversationResponse,
  ConversationsResponse,
  MessagesResponse,
} from "../../../shared/src/types/api/models";
import type { AppType } from "../app";

export const conversations = (app: AppType) => {
  return app
    .get("/conversations", async ({ supabase, headers }): Promise<ConversationsResponse> => {
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

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          figures (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq("user_id", authUser.user.id)
        .eq("is_deleted", false)
        .order("last_message_at", { ascending: false });

      if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);

      return {
        success: true,
        data,
        error: null,
        message: "Conversations retrieved successfully",
        timestamp: new Date().toISOString(),
      };
    })
    .post("/conversations", async ({ supabase, headers, body }): Promise<ConversationResponse> => {
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

      const { figure_id } = body as { figure_id: number };

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          user_id: authUser.user.id,
          figure_id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (convError) throw new Error(`Failed to create conversation: ${convError.message}`);

      return {
        success: true,
        data: conversation,
        error: null,
        message: "Conversation created successfully",
        timestamp: new Date().toISOString(),
      };
    })
    .get(
      "/conversations/:id/messages",
      async ({ supabase, headers, params }): Promise<MessagesResponse> => {
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

        // Verify user owns this conversation
        const { data: conv } = await supabase
          .from("conversations")
          .select("user_id")
          .eq("id", params.id)
          .single();

        if (conv?.user_id !== authUser.user.id) {
          throw new Error("Forbidden: You don't have access to this conversation");
        }

        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", params.id)
          .order("timestamp", { ascending: true });

        if (error) throw new Error(`Failed to fetch messages: ${error.message}`);

        return {
          success: true,
          data,
          error: null,
          message: "Messages retrieved successfully",
          timestamp: new Date().toISOString(),
        };
      },
    );
};
