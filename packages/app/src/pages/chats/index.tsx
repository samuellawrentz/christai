import type { Conversation } from "@christianai/shared/types/api/models";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Skeleton,
} from "@christianai/ui";
import { MoreVertical, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useConversations,
  useDeleteConversation,
  useToggleBookmark,
} from "@/hooks/use-conversations";

type FilterTab = "all" | "bookmarked";

export function ChatsListPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const { data: conversationsResponse, isLoading, error } = useConversations();
  const deleteMutation = useDeleteConversation();
  const toggleBookmarkMutation = useToggleBookmark();

  const conversations = conversationsResponse ?? [];

  const filteredConversations = conversations.filter((conv: Conversation) => {
    if (filter === "bookmarked") return conv.is_bookmarked;
    return true;
  });

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      deleteMutation.mutate(conversationToDelete);
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const handleToggleBookmark = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmarkMutation.mutate(conversationId);
  };

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

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === "bookmarked" ? "default" : "outline"}
          onClick={() => setFilter("bookmarked")}
          size="sm"
        >
          Bookmarked
        </Button>
      </div>

      {filteredConversations.length === 0 ? (
        <div className="text-center text-gray-500">
          {filter === "bookmarked"
            ? "No bookmarked conversations yet."
            : "No conversations yet. Start one from the Home page!"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map((conversation: Conversation) => (
            <div
              key={conversation.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg">💬</span>
                </div>
                <Link to={`/chats/${conversation.id}`} className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {conversation.title || "Untitled Conversation"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {conversation.message_count} messages
                  </p>
                </Link>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {new Date(conversation.updated_at).toLocaleDateString()}
                </div>
                <button
                  type="button"
                  onClick={(e) => handleToggleBookmark(e, conversation.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                  aria-label={conversation.is_bookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <Star
                    className={`w-5 h-5 ${
                      conversation.is_bookmarked
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      aria-label="More options"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBookmarkMutation.mutate(conversation.id);
                      }}
                    >
                      {conversation.is_bookmarked ? "Unbookmark" : "Bookmark"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(conversation.id);
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
