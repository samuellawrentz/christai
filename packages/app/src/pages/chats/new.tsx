"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  ScrollArea,
} from "@christianai/ui";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useStickToBottom } from "use-stick-to-bottom";
import { EmptyState } from "@/components/empty-state";
import { useCreateConversation } from "@/hooks/use-conversations";
import { useFigure } from "@/hooks/use-figures";

export function NewConversationPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  // Create useStickToBottom instance connected to ScrollArea viewport
  const stickToBottomInstance = useStickToBottom();

  // Load figure details
  const { data: figure, isLoading: figureLoading } = useFigure(slug!);

  // Mutation for creating conversations
  const createConversation = useCreateConversation();

  const handleSubmit = async (message: { text: string }) => {
    if (!message.text?.trim() || !figure) return;

    try {
      const newConversation = await createConversation.mutateAsync(figure.id);
      // Navigate to conversation page with initial message in router state
      navigate(`/chats/${newConversation.id}`, {
        replace: true,
        state: { initialMessage: message.text },
      });
    } catch {
      toast.error("Failed to start conversation. Please try again.");
    }

    setInput("");
  };

  if (figureLoading) {
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
          src={figure?.avatar_url}
          alt={`${figure?.display_name} avatar`}
          className="object-top [mask-image:linear-gradient(to_left,black_0%,black_30%,black_70%,transparent_100%),linear-gradient(to_top,black_0%,black_30%,black_90%,transparent_100%)] [mask-composite:intersect]"
        />
      </div>
      {/* Chat container */}
      <ScrollArea ref={stickToBottomInstance.scrollRef} className="h-[calc(100%-120px)]">
        <div ref={stickToBottomInstance.contentRef} className="flex flex-col gap-8 p-4 min-h-full">
          <EmptyState figureName={figure?.display_name} onStarterClick={handleSubmit} />
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
      <PromptInput onSubmit={handleSubmit} className="mt-auto">
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder={`Ask ${figure?.display_name || ""}...`}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit status="ready" disabled={!input.trim()} />
        </PromptInputFooter>
      </PromptInput>
    </main>
  );
}
