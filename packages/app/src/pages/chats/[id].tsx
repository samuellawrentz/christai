"use client";

import { useChat } from "@ai-sdk/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  ScrollArea,
  SidebarTrigger,
} from "@christianai/ui";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowDownIcon, Loader2, SidebarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useStickToBottom } from "use-stick-to-bottom";
import { useConversation, useConversationMessages } from "@/hooks/use-conversations";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export const ConversationPage = () => {
  const params = useParams<{ conversationId: string }>();
  const location = useLocation();
  const conversationId = params.conversationId;

  // Validate conversationId
  if (!conversationId) {
    return <Navigate to="/home" replace />;
  }

  // Get initial message from router state (passed from new conversation page)
  const initialMessage = (location.state as { initialMessage?: string })?.initialMessage;

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
      initialMessage={initialMessage}
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

  // Create useStickToBottom instance connected to ScrollArea viewport
  const stickToBottomInstance = useStickToBottom();

  // Load conversation details
  const { data: conversation, isLoading: convLoading } = useConversation(conversationId);
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
    if (initialMessage) {
      sendMessage({ text: initialMessage });
    }
  }, [initialMessage]);

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
      <header className="flex items-center gap-3 pb-4 border-b border-border mb-4">
        <SidebarTrigger className="md:hidden" />
        <Avatar className="h-10 w-10">
          <AvatarImage src={figure?.avatar_url} alt={figure?.display_name} />
          <AvatarFallback>{figure?.display_name?.[0]}</AvatarFallback>
        </Avatar>
        <h1 className="font-semibold text-lg">{figure?.display_name}</h1>
      </header>

      <div className="fixed -right-[470px] top-[50%] object-contain opacity-60 dark:opacity-40">
        <img
          src={figure?.avatar_url}
          alt={`${figure?.display_name} avatar`}
          className="object-top [mask-image:linear-gradient(to_left,black_0%,black_30%,black_70%,transparent_100%),linear-gradient(to_top,black_0%,black_30%,black_90%,transparent_100%)] [mask-composite:intersect]"
        />
      </div>
      {/* Chat container */}
      <ScrollArea ref={stickToBottomInstance.scrollRef} className="h-[calc(100%-120px)]">
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
