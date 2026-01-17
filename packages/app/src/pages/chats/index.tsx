import type { Conversation } from "@christianai/shared/types/api/models";
import { Skeleton } from "@christianai/ui";
import { Link } from "react-router-dom";
import { useConversations } from "@/hooks/use-conversations";

export function ChatsListPage() {
  const { data: conversationsResponse, isLoading, error } = useConversations();

  const conversations = conversationsResponse ?? [];

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <h1 className="text-3xl font-serif mb-6">Your Conversations</h1>
        <div className="text-center text-red-600">
          Failed to load conversations. Please try again.
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <h1 className="text-3xl font-serif mb-6">Your Conversations</h1>
      {conversations.length === 0 ? (
        <div className="text-center text-gray-500">
          No conversations yet. Start one from the Home page!
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation: Conversation) => (
            <Link
              key={conversation.id}
              to={`/chats/${conversation.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg">💬</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{conversation.title || "Untitled Conversation"}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{conversation.message_count} messages</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(conversation.updated_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
