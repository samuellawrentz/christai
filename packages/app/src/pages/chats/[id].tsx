"use client";

import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
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
import { DefaultChatTransport } from "ai";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStickToBottom } from "use-stick-to-bottom";
import { EmptyState } from "@/components/empty-state";
import {
  useConversation,
  useConversationMessages,
  useCreateConversation,
} from "@/hooks/use-conversations";
import { useFigure } from "@/hooks/use-figures";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export function ConversationPage() {
  // Check if this is a new conversation route (/chats/new/:slug) or existing (/chats/:conversationId)
  const isNewConversationRoute = window.location.pathname.startsWith("/chats/new/");
  const params = useParams<{ slug?: string; conversationId?: string }>();

  const slug = params.slug;
  const conversationId = params.conversationId;

  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [pendingMessage, setPendingMessage] = useState<{ text: string } | null>(null);
  const hasInitialized = useRef(false);

  // Create useStickToBottom instance connected to ScrollArea viewport
  const stickToBottomInstance = useStickToBottom();

  // Load figure details if this is a new conversation
  const { data: figure, isLoading: figureLoading } = useFigure(slug!);

  // Load conversation details (only makes API call if conversationId is valid)
  const { data: conversation, isLoading: convLoading } = useConversation(conversationId || "");

  // Load message history (only makes API call if conversationId is valid)
  const { data: messagesData, isLoading: msgsLoading } = useConversationMessages(
    conversationId || "",
  );

  // Mutation for creating conversations
  const createConversation = useCreateConversation();

  // Setup useChat - only makes API calls if conversationId is valid
  const { messages, setMessages, sendMessage, status } = useChat({
    id: conversationId,
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
            ...(body || {}), // Include additional body params like isGreeting
          },
        };
      },
    }),
  });

  // Reset initialization flag when conversation ID changes
  useEffect(() => {
    hasInitialized.current = false;
  }, [conversationId]);

  // Send pending message when conversation is ready
  useEffect(() => {
    if (pendingMessage && conversationId && !isNewConversationRoute) {
      sendMessage({ text: pendingMessage.text });
      setPendingMessage(null);
    }
  }, [conversationId, pendingMessage, isNewConversationRoute, sendMessage]);

  // Load messages when both queries complete (only for existing conversations)
  useEffect(() => {
    // Wait for both queries to complete
    if (msgsLoading || convLoading || !messagesData || !conversation) return;

    // Only run once per conversation
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Load messages into UI (already converted via select in hook)
    setMessages(messagesData);
  }, [messagesData, msgsLoading, convLoading, conversation, setMessages, conversationId]);

  const handleSubmit = async (message: { text: string }) => {
    if (!message.text?.trim()) return;

    // If this is a new conversation (slug route), create it first
    if (isNewConversationRoute && figure) {
      try {
        const newConversation = await createConversation.mutateAsync(figure.id);
        // Store the message to be sent after navigation completes
        setPendingMessage({ text: message.text });
        // Update URL to the new conversation ID
        navigate(`/chats/${newConversation.id}`, { replace: true });
      } catch (error) {
        console.error("Failed to create conversation:", error);
        return;
      }
    } else {
      // Existing conversation, send message normally
      sendMessage({ text: message.text });
    }

    setInput("");
  };

  if (
    (isNewConversationRoute && figureLoading) ||
    (!isNewConversationRoute && (convLoading || msgsLoading))
  ) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-4 h-[calc(100vh)] flex flex-col">
      <div className="fixed -right-[470px] top-[50%] object-contain opacity-60">
        <img
          src={
            isNewConversationRoute
              ? `${figure?.avatar_url}`
              : `${conversation?.figures?.avatar_url}`
          }
          alt={
            isNewConversationRoute
              ? `${figure?.display_name} avatar`
              : `${conversation?.figures?.display_name} avatar`
          }
          className="object-top [mask-image:linear-gradient(to_left,black_0%,black_30%,black_70%,transparent_100%),linear-gradient(to_top,black_0%,black_30%,black_90%,transparent_100%)] [mask-composite:intersect]"
        />
      </div>
      {/* Chat container */}
      <ScrollArea ref={stickToBottomInstance.scrollRef} className="h-[calc(100%-120px)]">
        <div ref={stickToBottomInstance.contentRef} className="flex flex-col gap-8 p-4 min-h-full">
          {messages.length === 0 && status !== "submitted" ? (
            <EmptyState
              figureName={
                isNewConversationRoute ? figure?.display_name : conversation?.figures?.display_name
              }
              onStarterClick={handleSubmit}
            />
          ) : (
            <>
              {messages.map((message: any) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent className="bg-transparent">
                    {message.parts.map((part: any, i: number) => {
                      if (part.type === "text") {
                        return (
                          <MessageResponse key={`${message.id}-${i}`}>{part.text}</MessageResponse>
                        );
                      }
                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))}
              {status === "submitted" && <Loader2 className="h-4 w-4 animate-spin" />}
            </>
          )}
        </div>
        {!stickToBottomInstance.isAtBottom && (
          <button
            className="absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full bg-background border border-border hover:bg-accent hover:text-accent-foreground h-10 w-10 flex items-center justify-center"
            onClick={() => stickToBottomInstance.scrollToBottom()}
            type="button"
          >
            <ArrowDownIcon className="size-4" />
          </button>
        )}
      </ScrollArea>

      {/* Input */}
      <PromptInput onSubmit={handleSubmit} className="mt-auto">
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder={
              isNewConversationRoute
                ? `Ask ${figure?.display_name || ""}...`
                : `Ask ${conversation?.figures?.display_name || ""}...`
            }
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit status={status} disabled={!input.trim()} />
        </PromptInputFooter>
      </PromptInput>
    </main>
  );
}
