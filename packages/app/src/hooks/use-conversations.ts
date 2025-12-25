import type { Message } from "@christianai/shared/types/api/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { conversationsApi } from "@/lib/api";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: conversationsApi.list,
    staleTime: 30 * 1000, // 30 seconds (conversations update frequently)
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (figureId: number) => conversationsApi.create(figureId),
    onSuccess: (response) => {
      // Invalidate conversations list to refetch
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Navigate to the new conversation
      navigate(`/chats/${response?.id}`);
    },
    onError: (error) => {
      toast.error("Failed to start conversation. Please try again.");
      console.error("Create conversation error:", error);
    },
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => conversationsApi.get(conversationId),
    enabled: !!conversationId,
  });
}

export function useConversationMessages(conversationId: string) {
  return useQuery<Message[]>({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => conversationsApi.getMessages(conversationId),
    enabled: !!conversationId, // Only fetch if conversationId exists
  });
}
