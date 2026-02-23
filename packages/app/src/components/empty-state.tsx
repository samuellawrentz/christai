import { Badge } from "@christianai/ui";

interface EmptyStateProps {
  figureName?: string;
  onStarterClick: (message: { text: string }) => void;
}

const STARTER_PROMPTS = [
  "Hello! I'd love to hear about your teachings",
  "Can you help me understand your story in the Bible?",
  "What wisdom can you share with me today?",
  "I'd like to learn more about your life and message",
];

export function EmptyState({ figureName, onStarterClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Start a conversation with {figureName || "this biblical figure"}
        </h2>
        <p className="text-muted-foreground">
          Choose a message below or type your own question to begin
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onStarterClick({ text: prompt })}
            className="transition-colors"
          >
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              {prompt}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
