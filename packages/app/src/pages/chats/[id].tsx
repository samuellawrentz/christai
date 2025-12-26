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
import { useLocation, useParams } from "react-router-dom";
import { useStickToBottom } from "use-stick-to-bottom";
import { useConversation, useConversationMessages } from "@/hooks/use-conversations";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export function ConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId!;
  const location = useLocation();

  const [input, setInput] = useState("");
  const initialMessageSentRef = useRef(false);

  // Create useStickToBottom instance connected to ScrollArea viewport
  const stickToBottomInstance = useStickToBottom();

  // Load conversation details
  const { data: conversation, isLoading: convLoading } = useConversation(conversationId);

  // Load message history
  const { data: messagesData, isLoading: msgsLoading } = useConversationMessages(conversationId);

  // Setup useChat
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
            ...(body || {}),
          },
        };
      },
    }),
  });

  // Load messages when data is available (skip if sending initial message)
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (messagesData && !initialMessage) {
      setMessages(messagesData);
    }
  }, [messagesData, setMessages, location.state]);

  // Send initial message from navigation state once
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      sendMessage({ text: initialMessage });
      // Clear state to prevent re-sending
      window.history.replaceState({}, "");
    }
  }, [location.state, sendMessage]);

  const handleSubmit = async (message: { text: string }) => {
    if (!message.text?.trim()) return;

    sendMessage({ text: message.text });
    setInput("");
  };

  if (convLoading || msgsLoading) {
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
          src={conversation?.figures?.avatar_url}
          alt={`${conversation?.figures?.display_name} avatar`}
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
            placeholder={`Ask ${conversation?.figures?.display_name || ""}...`}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit status={status} disabled={!input.trim()} />
        </PromptInputFooter>
      </PromptInput>
    </main>
  );
}
