import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  Skeleton,
} from "@christianai/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FigureSelectDropdown } from "@/components/figures/figure-select";
import { useCreateConversation } from "@/hooks/use-conversations";
import { useFigures } from "@/hooks/use-figures";

const QUICK_PROMPTS = [
  "What does the Bible say about forgiveness?",
  "Help me understand the Sermon on the Mount",
  "How can I grow in faith?",
  "Tell me about the parables of Jesus",
];

export function HomePage() {
  const { data: figuresResponse, isLoading, error } = useFigures();
  const createConversation = useCreateConversation();
  const navigate = useNavigate();

  const [selectedFigureSlug, setSelectedFigureSlug] = useState("jesus");
  const [input, setInput] = useState("");

  const figures = figuresResponse ?? [];
  const selectedFigure = figures.find((f) => f.slug === selectedFigureSlug) ?? figures[0];

  // Typewriter cycling through figure names
  const [displayedName, setDisplayedName] = useState("");
  const [figureIndex, setFigureIndex] = useState(0);
  const phaseRef = useRef<"typing" | "pausing" | "deleting">("typing");
  const charRef = useRef(0);

  useEffect(() => {
    if (figures.length === 0) return;

    const tick = () => {
      const phase = phaseRef.current;
      const name = figures[figureIndex]?.display_name ?? "";

      if (phase === "typing") {
        charRef.current++;
        setDisplayedName(name.slice(0, charRef.current));
        if (charRef.current >= name.length) {
          phaseRef.current = "pausing";
          return 2000;
        }
        return 80;
      }
      if (phase === "pausing") {
        phaseRef.current = "deleting";
        return 0;
      }
      // deleting
      charRef.current--;
      setDisplayedName(name.slice(0, charRef.current));
      if (charRef.current <= 0) {
        phaseRef.current = "typing";
        setFigureIndex((i) => (i + 1) % figures.length);
        return 300;
      }
      return 40;
    };

    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = tick();
      timeout = setTimeout(schedule, delay);
    };
    schedule();

    return () => clearTimeout(timeout);
  }, [figures, figureIndex]);

  const handleFigureClick = useCallback(() => {
    const figure = figures[figureIndex];
    if (figure) {
      setSelectedFigureSlug(figure.slug);
    }
  }, [figures, figureIndex]);

  const handleSubmit = async () => {
    if (!input.trim() || !selectedFigure || createConversation.isPending) return;
    try {
      const message = input;
      setInput("");
      const newConversation = await createConversation.mutateAsync(selectedFigure.id);
      navigate(`/chats/${newConversation.id}`, {
        replace: true,
        state: { initialMessage: message },
      });
    } catch {
      // error handling is in hook
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <Skeleton className="h-8 w-64 mb-12" />
        <Skeleton className="h-36 w-full max-w-xl rounded-xl" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <p className="text-muted-foreground">Unable to load. Please refresh.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="font-scripture text-4xl md:text-5xl italic text-center mb-2 tracking-tight">
          What's on your heart?
        </h1>
        <p className="text-muted-foreground text-sm mb-10 text-center h-6">
          Talk to{" "}
          <button
            type="button"
            onClick={handleFigureClick}
            className="text-foreground font-medium hover:underline underline-offset-2 cursor-pointer transition-colors"
          >
            {displayedName}
          </button>
          <span className="animate-pulse">|</span>
        </p>

        <div className="w-full">
          <PromptInput
            onSubmit={handleSubmit}
            className="rounded-xl border border-border/50 shadow-sm"
          >
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
              <PromptInputSubmit disabled={!input.trim() || createConversation.isPending} />
            </PromptInputFooter>
          </PromptInput>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setInput(prompt)}
              className="px-3.5 py-1.5 text-xs text-muted-foreground rounded-full border border-border/40 hover:border-border hover:text-foreground transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
