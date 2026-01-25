import type { Figure } from "@christianai/shared";
import { Card } from "@christianai/ui";
import { Lock } from "lucide-react";

interface HomeFigureCardProps {
  figure: Figure;
  onClick: () => void;
  isLocked: boolean;
}

export function HomeFigureCard({ figure, onClick, isLocked }: HomeFigureCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer hover:shadow-md transition ${
        isLocked ? "grayscale opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative">
          <img
            src={figure.avatar_url}
            alt={figure.display_name}
            className="w-20 aspect-square object-cover rounded"
          />
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
              <Lock className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{figure.display_name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{figure.description}</p>
        </div>
      </div>
    </Card>
  );
}
