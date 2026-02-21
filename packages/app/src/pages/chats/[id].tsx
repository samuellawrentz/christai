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
  PromptInputSubmit,
  PromptInputTextarea,
  ScrollArea,
} from "@christianai/ui";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowDownIcon, CheckIcon, CopyIcon, Loader2, PencilIcon, ShareIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

  // Capture initial message once per conversationId - survives state clearing
  const initialMessageRef = useRef<{ [key: string]: string | undefined }>({});
  const stateMessage = (location.state as { initialMessage?: string })?.initialMessage;

  if (conversationId && stateMessage && !initialMessageRef.current[conversationId]) {
    initialMessageRef.current[conversationId] = stateMessage;
  }

  // Clear router state to prevent back-button issues
  useEffect(() => {
    if (stateMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [stateMessage, navigate, location.pathname]);

  if (!conversationId) {
    return <Navigate to="/home" replace />;
  }

  // Key by conversationId to force full remount on navigation
  return (
    <ConversationLoader
      key={conversationId}
      conversationId={conversationId}
      initialMessage={initialMessageRef.current[conversationId]}
    />
  );
};

function ConversationLoader({
  conversationId,
  initialMessage,
}: {
  conversationId: string;
  initialMessage?: string;
}) {
  const {
    data: messagesData,
    isLoading: msgsLoading,
    error,
  } = useConversationMessages(conversationId);

  if (error) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center text-red-600">
          Failed to load conversation. Please try again.
        </div>
      </div>
    );
  }

  if (msgsLoading || !messagesData)
    return (
      <div className="absolute inset-0 grid place-items-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );

  return (
    <ConversationCore
      conversationId={conversationId}
      messagesData={messagesData}
      initialMessage={initialMessage}
    />
  );
}

interface ConversationCoreProps {
  conversationId: string;
  messagesData: UIMessage[];
  initialMessage?: string;
}

function ConversationCore({ conversationId, messagesData, initialMessage }: ConversationCoreProps) {
  const [input, setInput] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const initialMessageSentRef = useRef(false);

  const stickToBottomInstance = useStickToBottom();
  const { data: conversation, isLoading: convLoading } = useConversation(conversationId);

  const updateTitle = useUpdateTitle();
  const createShare = useCreateShare();

  // Memoize transport - stable reference
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${api.baseUrl}/chats/converse`,
        headers: async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          return { Authorization: `Bearer ${session?.access_token}` };
        },
        prepareSendMessagesRequest: ({ messages: uiMessages, id, body }) => {
          const lastMessage = uiMessages[uiMessages.length - 1];
          const messageText = lastMessage?.parts?.find((part) => part.type === "text")?.text || "";
          return {
            body: { conversationId: id, message: messageText, ...(body || {}) },
          };
        },
      }),
    [],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    id: conversationId,
    messages: messagesData,
    transport,
  });

  // Sync messages imperatively when data changes — useChat's messages prop is initialization-only
  useEffect(() => {
    if (messagesData && messagesData.length > 0) {
      setMessages(messagesData);
    }
  }, [messagesData, setMessages]);

  // Send initial message once
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
    <main className="max-w-3xl w-full mx-auto px-4 py-4 h-[calc(100vh)] flex flex-col">
      {/* Header */}
      <header className="hidden md:flex items-center gap-3 pb-3">
        <Avatar className="h-8 w-8">
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
              className="h-6 text-sm px-1 border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          ) : (
            <button
              type="button"
              onClick={startEditingTitle}
              className="group flex items-center gap-1.5 text-left"
            >
              <span className="text-sm truncate">{conversation?.title}</span>
              <PencilIcon className="size-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={handleShare}
          disabled={createShare.isPending}
        >
          {createShare.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <ShareIcon className="size-3.5 text-muted-foreground" />
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

      {/* Chat container */}
      <ScrollArea ref={stickToBottomInstance.scrollRef} className="flex-1">
        <div ref={stickToBottomInstance.contentRef} className="flex flex-col gap-6 py-6 min-h-full">
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
      <div className="pt-2 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {TOPIC_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => setInput(suggestion.prompt)}
                className="px-3 py-1.5 text-xs text-muted-foreground rounded-full border border-border/40 hover:border-border hover:text-foreground transition-colors"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        )}
        <PromptInput
          onSubmit={handleSubmit}
          className="rounded-xl border border-border/50 shadow-sm"
        >
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
      </div>
    </main>
  );
}
