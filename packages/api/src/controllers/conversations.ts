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
    })
    .post("/conversations/:id/share", async ({ supabase, params }) => {
      const conversationId = params.id;
      const shareToken = crypto.randomUUID().slice(0, 8);

      // Check if share already exists for this conversation
      const { data: existing } = await supabase
        .from("conversation_shares")
        .select("share_token")
        .eq("conversation_id", conversationId)
        .eq("is_active", true)
        .single();

      if (existing) {
        return {
          share_token: existing.share_token,
          share_url: `https://app.christianai.world/share/${existing.share_token}`,
        };
      }

      // Create new share
      const { data, error } = await supabase
        .from("conversation_shares")
        .insert({
          conversation_id: conversationId,
          share_token: shareToken,
          is_active: true,
        })
        .select("share_token")
        .single();

      if (error) throw new Error(`Failed to create share: ${error.message}`);

      return {
        share_token: data.share_token,
        share_url: `https://app.christianai.world/share/${data.share_token}`,
      };
    })
    .delete("/conversations/:id", async ({ supabase, params }) => {
      const { data, error } = await supabase
        .from("conversations")
        .update({ is_deleted: true })
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to delete conversation: ${error.message}`);
      if (!data) throw new Error("Conversation not found");

      return data;
    })
    .patch("/conversations/:id", async ({ supabase, params, body }) => {
      const { title } = body as { title: string };

      if (!title || title.trim() === "") {
        throw new Error("Title cannot be empty");
      }

      const { data, error } = await supabase
        .from("conversations")
        .update({ title: title.trim() })
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update conversation: ${error.message}`);
      if (!data) throw new Error("Conversation not found");

      return data;
    })
    .patch("/conversations/:id/bookmark", async ({ supabase, params }) => {
      // First, get current bookmark status
      const { data: current, error: fetchError } = await supabase
        .from("conversations")
        .select("is_bookmarked")
        .eq("id", params.id)
        .single();

      if (fetchError) throw new Error(`Failed to fetch conversation: ${fetchError.message}`);
      if (!current) throw new Error("Conversation not found");

      // Toggle bookmark
      const { data, error } = await supabase
        .from("conversations")
        .update({ is_bookmarked: !current.is_bookmarked })
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update bookmark: ${error.message}`);
      if (!data) throw new Error("Conversation not found");

      return data;
    });
};
