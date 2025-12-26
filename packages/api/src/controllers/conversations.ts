import type { AppType } from "../app";

export const conversations = (app: AppType) => {
  return app
    .get("/figures/:slug", async ({ supabase, params }) => {
      const { data, error } = await supabase
        .from("figures")
        .select("*")
        .eq("slug", params.slug)
        .eq("is_active", true)
        .single();

      if (error) throw new Error(`Failed to fetch figure: ${error.message}`);
      if (!data) throw new Error("Figure not found");

      return data;
    })
    .get("/conversations", async ({ supabase }) => {
      // RLS automatically filters by auth.uid()
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
        .eq("is_deleted", false)
        .order("last_message_at", { ascending: false });

      if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);

      return data;
    })
    .post("/conversations", async ({ supabase, userId, body }) => {
      const { figure_id } = body as { figure_id: number };

      // Create conversation (RLS ensures user_id matches auth.uid())
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          user_id: userId, // Still need to set this on insert
          figure_id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (convError) throw new Error(`Failed to create conversation: ${convError.message}`);

      return conversation;
    })
    .get("/conversations/:id", async ({ supabase, params }) => {
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
        .eq("id", params.id)
        .eq("is_deleted", false)
        .single();

      if (error) throw new Error(`Failed to fetch conversation: ${error.message}`);
      if (!data) throw new Error("Conversation not found");

      return data;
    })
    .get("/conversations/:id/messages", async ({ supabase, params }) => {
      // RLS automatically filters messages by user's conversations
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", params.id)
        .order("timestamp", { ascending: true });

      if (error) throw new Error(`Failed to fetch messages: ${error.message}`);

      return data;
    });
};
