"use client";

import { useChat } from "@ai-sdk/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  ScrollArea,
  SidebarTrigger,
} from "@christianai/ui";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowDownIcon, CheckIcon, CopyIcon, Loader2, PencilIcon, ShareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useStickToBottom } from "use-stick-to-bottom";
import {
  useConversation,
  useConversationMessages,
  useCreateShare,
  useUpdateTitle,
} from "@/hooks/use-conversations";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const TOPIC_SUGGESTIONS = [
  { label: "Faith & Doubt", prompt: "How do I maintain faith when facing doubt?" },
  { label: "Prayer Life", prompt: "How can I improve my prayer life?" },
  { label: "Scripture Study", prompt: "What's the best way to study Scripture effectively?" },
  { label: "Life Purpose", prompt: "How do I discover God's purpose for my life?" },
];

export const ConversationPage = () => {
  const params = useParams<{ conversationId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const conversationId = params.conversationId;

  // Get initial message from router state (passed from new conversation page)
  const initialMessage = (location.state as { initialMessage?: string })?.initialMessage;
  const initialMessageRef = useRef(initialMessage);

  // Clear the router state immediately to prevent re-sending on re-renders
  useEffect(() => {
    if (initialMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  // Validate conversationId
  if (!conversationId) {
    return <Navigate to="/home" replace />;
  }

  // Load message history
  const {
    data: messagesData,
    isLoading: msgsLoading,
    error,
  } = useConversationMessages(conversationId);

  if (msgsLoading || !messagesData)
    return (
      <div className="absolute inset-0 grid place-items-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );

  if (error) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center text-red-600">
          Failed to load conversation. Please try again.
        </div>
      </div>
    );
  }

  return (
    <ConversationCore
      conversationId={conversationId}
      messagesData={messagesData}
      initialMessage={initialMessageRef.current}
    />
  );
};

interface ConversationCoreProps {
  conversationId: string;
  messagesData: UIMessage[];
  initialMessage?: string;
}

function ConversationCore({ conversationId, messagesData, initialMessage }: ConversationCoreProps) {
  const [input, setInput] = useState("");
  const initialMessageSentRef = useRef(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Create useStickToBottom instance connected to ScrollArea viewport
  const stickToBottomInstance = useStickToBottom();

  // Load conversation details
  const { data: conversation, isLoading: convLoading } = useConversation(conversationId);

  // Mutations
  const updateTitle = useUpdateTitle();
  const createShare = useCreateShare();
  // Setup useChat
  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: messagesData,
    transport: new DefaultChatTransport({
      api: `${api.baseUrl}/chats/converse`,
      headers: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        return {
          Authorization: `Bearer ${session?.access_token}`,
        };
      },
      prepareSendMessagesRequest: ({ messages: uiMessages, id, body }) => {
        const lastMessage = uiMessages[uiMessages.length - 1];
        const messageText = lastMessage?.parts?.find((part) => part.type === "text")?.text || "";
        return {
          body: {
            conversationId: id,
            message: messageText,
            ...(body || {}),
          },
        };
      },
    }),
  });

  useEffect(() => {
    if (initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      sendMessage({ text: initialMessage });
    }
  }, [initialMessage, sendMessage]);

  // Title editing handlers
  const startEditingTitle = () => {
    setEditedTitle(conversation?.title || "");
    setIsEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const saveTitle = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== conversation?.title) {
      updateTitle.mutate({ id: conversationId, title: trimmed });
    }
    setIsEditingTitle(false);
  };

  const cancelEditTitle = () => {
    setIsEditingTitle(false);
    setEditedTitle("");
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveTitle();
    } else if (e.key === "Escape") {
      cancelEditTitle();
    }
  };

  // Share handlers
  const handleShare = async () => {
    try {
      const share = await createShare.mutateAsync(conversationId);
      const link = `${window.location.origin}/share/${share.share_token}`;
      setShareLink(link);
      setShareDialogOpen(true);
    } catch {
      // Error toast handled by hook
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleSubmit = async (message: { text: string }) => {
    if (!message.text?.trim()) return;

    sendMessage({ text: message.text });
    setInput("");
  };

  if (convLoading) return null;

  const figure = conversation?.figures;

  return (
    <main className="max-w-4xl w-full mx-auto px-4 py-4 h-[calc(100vh)] flex flex-col">
      {/* Header */}
      <header className="hidden md:flex items-center gap-3 pb-4 border-b border-border">
        <SidebarTrigger className="md:hidden" />
        <Avatar className="h-10 w-10">
          <AvatarImage src={figure?.avatar_url} alt={figure?.display_name} />
          <AvatarFallback>{figure?.display_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={handleTitleKeyDown}
              className="h-7 text-lg font-semibold px-1 border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          ) : (
            <button
              type="button"
              onClick={startEditingTitle}
              className="group flex items-center gap-1.5 text-left"
            >
              <h1 className="font-semibold text-lg truncate">{conversation?.title}</h1>
              <PencilIcon className="size-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
          )}
          <span className="text-xs text-gray-600 dark:text-gray-400">{figure?.display_name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleShare} disabled={createShare.isPending}>
          {createShare.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ShareIcon className="size-4" />
          )}
        </Button>
      </header>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share conversation</DialogTitle>
            <DialogDescription>Anyone with this link can view this conversation.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input readOnly value={shareLink} className="flex-1" />
            <Button size="icon" onClick={copyShareLink}>
              {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed -right-[470px] top-[50%] object-contain opacity-60 dark:opacity-40">
        <img
          src={figure?.avatar_url}
          alt={`${figure?.display_name} avatar`}
          className="object-top [mask-image:linear-gradient(to_left,black_0%,black_30%,black_70%,transparent_100%),linear-gradient(to_top,black_0%,black_30%,black_90%,transparent_100%)] [mask-composite:intersect]"
        />
      </div>
      {/* Chat container */}
      <ScrollArea
        ref={stickToBottomInstance.scrollRef}
        className="md:h-[calc(100%-200px)] h-[calc(100%-120px)]"
      >
        <div ref={stickToBottomInstance.contentRef} className="flex flex-col gap-8 p-4 min-h-full">
          {messages.map((message) => {
            const textContent = message.parts.find((part) => part.type === "text")?.text || "";
            return (
              <Message key={message.id} from={message.role}>
                <MessageContent className="bg-transparent">
                  <MessageResponse>{textContent}</MessageResponse>
                </MessageContent>
              </Message>
            );
          })}
          {status === "submitted" && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        {!stickToBottomInstance.isAtBottom && (
          <button
            className="absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full bg-background border border-border hover:bg-accent hover:text-accent-foreground h-10 w-10 flex items-center justify-center"
            onClick={() => stickToBottomInstance.scrollToBottom()}
            type="button"
            aria-label="Scroll to bottom"
          >
            <ArrowDownIcon className="size-4" />
          </button>
        )}
      </ScrollArea>

      {/* Input */}
      <PromptInput onSubmit={handleSubmit} className="mt-auto backdrop-brightness-90 rounded-md">
        {messages.length === 0 && (
          <PromptInputHeader>
            {TOPIC_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => setInput(suggestion.prompt)}
                className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-accent transition-colors"
              >
                {suggestion.label}
              </button>
            ))}
          </PromptInputHeader>
        )}
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder={`Ask ${figure?.display_name || ""}...`}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit status={status} disabled={!input.trim()} />
        </PromptInputFooter>
      </PromptInput>
    </main>
  );
}
