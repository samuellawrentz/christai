import type { Figure } from "@christianai/shared/types/api/models";
import { Card } from "@christianai/ui";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useCreateConversation } from "@/hooks/use-conversations";

type Props = {
  figure: Figure;
  userHasPro: boolean;
};

export function FigureCard({ figure, userHasPro }: Props) {
  const createConversation = useCreateConversation();

  const isLocked = figure.requires_pro && !userHasPro;

  const handleClick = async () => {
    if (isLocked) {
      toast.error("This figure requires a Pro subscription. Please upgrade to access.");
      return;
    }

    try {
      await createConversation.mutateAsync(figure.id);
    } catch (_error) {
      toast.error("Failed to start conversation. Please try again.");
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isLocked ? "opacity-60 grayscale" : ""
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        {isLocked && (
          <div className="absolute top-2 right-2 bg-gray-800/80 rounded-full p-2">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="w-full h-32 bg-gray-100 rounded-t-lg flex items-center justify-center">
          <User className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-center mb-2">{figure.display_name}</h3>
        {figure.description && (
          <p className="text-sm text-gray-600 text-center line-clamp-2 mb-2">
            {figure.description}
          </p>
        )}
        {figure.requires_pro && (
          <div className="text-xs text-orange-600 text-center font-medium">Pro</div>
        )}
      </div>
    </Card>
  );
}
