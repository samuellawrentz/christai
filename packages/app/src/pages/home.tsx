import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  Skeleton,
} from "@christianai/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FigureSelectDropdown } from "@/components/figures/figure-select";
import { useCreateConversation } from "@/hooks/use-conversations";
import { useFigures } from "@/hooks/use-figures";

export function HomePage() {
  const { data: figuresResponse, isLoading, error } = useFigures();
  const createConversation = useCreateConversation();
  const navigate = useNavigate();

  const [selectedFigureSlug, setSelectedFigureSlug] = useState("jesus");
  const [input, setInput] = useState("");

  const figures = figuresResponse ?? [];
  const selectedFigure = figures.find((f) => f.slug === selectedFigureSlug) ?? figures[0];

  const handleSubmit = async () => {
    if (!input.trim() || !selectedFigure) return;
    try {
      const newConversation = await createConversation.mutateAsync(selectedFigure.id);
      navigate(`/chats/${newConversation.id}`, {
        replace: true,
        state: { initialMessage: input },
      });
    } catch (error) {
      // error handling is in hook
    }
    setInput("");
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Skeleton className="h-10 w-96 mb-8" />
        <Skeleton className="h-40 w-full max-w-2xl" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to ChristianAI</h1>
        <div className="text-center text-red-600">Failed to load figures. Please try again.</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to ChristianAI</h1>

      <div className="w-full max-w-2xl">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <FigureSelectDropdown
              figures={figures}
              value={selectedFigureSlug}
              onValueChange={setSelectedFigureSlug}
            />
            <PromptInputSubmit disabled={!input.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </main>
  );
}
