import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  Skeleton,
} from "@christianai/ui";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FigureSelectDropdown } from "@/components/figures/figure-select";
import { HomeFigureCard } from "@/components/figures/home-figure-card";
import { useCreateConversation } from "@/hooks/use-conversations";
import { useFigures } from "@/hooks/use-figures";
import { useSubscription } from "@/hooks/use-subscription";

export function HomePage() {
  const { data: figuresResponse, isLoading, error } = useFigures();
  const { data: subscription } = useSubscription();
  const createConversation = useCreateConversation();
  const navigate = useNavigate();

  const [selectedFigureSlug, setSelectedFigureSlug] = useState("jesus");
  const [input, setInput] = useState("");

  const figures = figuresResponse ?? [];
  const userHasPro = subscription?.data?.status === "active";
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
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <Skeleton className="h-10 w-96 mx-auto mb-8" />
        <Skeleton className="h-40 max-w-2xl mx-auto mb-8" />
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to ChristianAI</h1>
        <div className="text-center text-red-600">Failed to load figures. Please try again.</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to ChristianAI</h1>

      <div className="max-w-2xl mx-auto">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputHeader>
            <FigureSelectDropdown
              figures={figures}
              value={selectedFigureSlug}
              onValueChange={setSelectedFigureSlug}
            />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit disabled={!input.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
        {figures.slice(0, 4).map((figure) => (
          <HomeFigureCard
            key={figure.id}
            figure={figure}
            onClick={() => setSelectedFigureSlug(figure.slug)}
            isLocked={figure.requires_pro && !userHasPro}
          />
        ))}
      </div>

      <div className="text-center mt-6">
        <Link to="/figures" className="text-primary hover:underline">
          View more people
        </Link>
      </div>
    </main>
  );
}
