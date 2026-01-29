import type { Message } from "@christianai/shared/types/api/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UIMessage } from "ai";
import { toast } from "sonner";
import { conversationsApi } from "@/lib/api";
import { convertToUIMessages } from "@/utils/message-adapter";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: conversationsApi.list,
    staleTime: 30 * 1000, // 30 seconds (conversations update frequently)
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (figureId: number) => conversationsApi.create(figureId),
    onSuccess: () => {
      // Invalidate conversations list to refetch
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Note: Navigation is handled by the component, not here
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
  return useQuery<Message[], Error, UIMessage[]>({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => conversationsApi.getMessages(conversationId),
    enabled: !!conversationId,
    select: (data) => convertToUIMessages(data),
    staleTime: 5000, // 5 seconds - short enough to get recent messages
    refetchOnMount: true, // Always check for updates on mount
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => conversationsApi.delete(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast.error("Failed to delete conversation. Please try again.");
      console.error("Delete conversation error:", error);
    },
  });
}

export function useUpdateTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      conversationsApi.updateTitle(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast.error("Failed to update title. Please try again.");
      console.error("Update title error:", error);
    },
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => conversationsApi.toggleBookmark(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast.error("Failed to toggle bookmark. Please try again.");
      console.error("Toggle bookmark error:", error);
    },
  });
}

export function useCreateShare() {
  return useMutation({
    mutationFn: (conversationId: string) => conversationsApi.createShare(conversationId),
    onError: (error) => {
      toast.error("Failed to create share link. Please try again.");
      console.error("Create share error:", error);
    },
  });
}

export function usePublicShare(shareId: string) {
  return useQuery({
    queryKey: ["public-share", shareId],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || "https://api.christianai.world";
      const response = await fetch(`${baseUrl}/public/share/${shareId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch shared conversation");
      }

      const apiResponse = await response.json();
      return apiResponse.data;
    },
    enabled: !!shareId,
  });
}
