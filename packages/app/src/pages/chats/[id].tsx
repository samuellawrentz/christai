"use client";

import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Loader,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@christianai/ui";
import { DefaultChatTransport } from "ai";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useConversation, useConversationMessages } from "@/hooks/use-conversations";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { convertToUIMessages } from "@/utils/message-adapter";

export function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const [input, setInput] = useState("");

  // Load conversation details
  const { data: conversationData, isLoading: convLoading } = useConversation(id!);
  const conversation = conversationData?.data;

  // Load message history
  const { data: messagesData, isLoading: msgsLoading } = useConversationMessages(id!);

  // Setup useChat with custom auth
  const { messages, sendMessage, status } = useChat({
    id,
    messages: messagesData?.data ? convertToUIMessages(messagesData.data) : [],
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

  // Auto-send greeting when conversation is empty
  useEffect(() => {
    if (!msgsLoading && messages.length === 0 && conversation && status === "ready") {
      sendMessage(
        { text: "hello" },
        {
          body: { isGreeting: true },
        },
      );
    }
  }, [msgsLoading, messages.length, conversation, status, sendMessage]);

  const handleSubmit = (message: { text: string }) => {
    if (!message.text?.trim()) return;
    sendMessage({ text: message.text });
    setInput("");
  };

  if (convLoading || msgsLoading) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 py-4 h-[calc(100vh-180px)]">
        {/* Chat container */}
        <Conversation className="h-[calc(100%-200px)]">
          <ConversationContent>
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, i) => {
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
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input */}
        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              placeholder={`Message ${conversation?.figures?.display_name || ""}...`}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit status={status} disabled={!input.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </main>

      <BottomNav />
    </div>
  );
}
