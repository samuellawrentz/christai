"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Message,
  MessageContent,
  MessageResponse,
  ScrollArea,
} from "@christianai/ui";
import type { UIMessage } from "ai";
import { ArrowDownIcon, ArrowRightIcon, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useStickToBottom } from "use-stick-to-bottom";
import { usePublicShare } from "@/hooks/use-conversations";

export const SharePage = () => {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const stickToBottomInstance = useStickToBottom();

  const { data: shareData, isLoading, error } = usePublicShare(token || "");

  if (isLoading) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  if (error || !shareData) {
    return (
      <div className="absolute inset-0 grid place-items-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Share not found</h1>
          <p className="text-muted-foreground">
            This conversation doesn't exist or is no longer available.
          </p>
          <Button asChild>
            <a href="/">Go to Homepage</a>
          </Button>
        </div>
      </div>
    );
  }

  const conversation = shareData.conversations as any;
  const figure = conversation?.figures;
  const messages: UIMessage[] = (shareData.messages || []).map((msg: any) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    parts: [
      {
        type: "text" as const,
        text: msg.content,
        state: "done" as const,
      },
    ],
  }));

  return (
    <main className="max-w-4xl w-full mx-auto px-4 py-8 h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 pb-6 border-b border-border">
        <Avatar className="h-12 w-12">
          <AvatarImage src={figure?.avatar_url} alt={figure?.display_name} />
          <AvatarFallback>{figure?.display_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <h1 className="font-semibold text-xl">
            {conversation?.title || "Untitled Conversation"}
          </h1>
          <span className="text-sm text-muted-foreground">{figure?.display_name}</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
          Read-only
        </div>
      </header>

      {/* Background figure image */}
      <div className="fixed -right-[470px] top-[50%] object-contain opacity-60 dark:opacity-40 pointer-events-none">
        <img
          src={figure?.avatar_url}
          alt={`${figure?.display_name} avatar`}
          className="object-top [mask-image:linear-gradient(to_left,black_0%,black_30%,black_70%,transparent_100%),linear-gradient(to_top,black_0%,black_30%,black_90%,transparent_100%)] [mask-composite:intersect]"
        />
      </div>

      {/* Messages container */}
      <ScrollArea ref={stickToBottomInstance.scrollRef} className="flex-1 my-6">
        <div ref={stickToBottomInstance.contentRef} className="flex flex-col gap-8 p-4 min-h-full">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No messages in this conversation yet.
            </div>
          ) : (
            messages.map((message) => {
              const textContent = message.parts.find((part) => part.type === "text")?.text || "";
              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent className="bg-transparent">
                    <MessageResponse>{textContent}</MessageResponse>
                  </MessageContent>
                </Message>
              );
            })
          )}
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

      {/* CTA Footer */}
      <footer className="mt-auto pt-6 border-t border-border">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Want to have your own conversation?</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Join ChristianAI to chat with {figure?.display_name} and other biblical figures
          </p>
          <Button asChild size="lg">
            <a href="/signup" className="inline-flex items-center gap-2">
              Start your own conversation
              <ArrowRightIcon className="size-4" />
            </a>
          </Button>
        </div>
      </footer>
    </main>
  );
};
