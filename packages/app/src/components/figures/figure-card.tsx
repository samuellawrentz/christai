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
      className={`group relative cursor-pointer transition-all hover:shadow-lg min-h-64 overflow-hidden py-4 ${
        isLocked ? "opacity-60 grayscale" : ""
      }`}
      onClick={handleClick}
    >
      {figure.avatar_url && (
        <div
          className="absolute top-0 w-full h-[120%] bg-cover bg-center transition-transform ease-in-out duration-400 group-hover:scale-110"
          style={{ backgroundImage: `url(${figure.avatar_url})` }}
        />
      )}
      {figure.avatar_url && (
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 duration-300" />
      )}
      <div className="relative z-10 px-4 h-full flex flex-col justify-end">
        {isLocked && (
          <div className="absolute top-2 right-2 bg-gray-800/80 rounded-full p-2">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
        {!figure.avatar_url && (
          <div className="w-full h-32 bg-gray-100 rounded-t-lg flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <h3
          className={`text-lg group-hover:text-xl mb-2 font-bold duration-300 ease-initial ${figure.avatar_url ? "text-white" : ""}`}
        >
          {figure.display_name}
        </h3>
        {figure.description && (
          <p
            className={`text-sm line-clamp-2 mb-2 ${
              figure.avatar_url ? "text-gray-200" : "text-gray-600"
            }`}
          >
            {figure.description}
          </p>
        )}
        {figure.requires_pro && (
          <div
            className={`text-xs text-center font-medium ${
              figure.avatar_url ? "text-orange-300" : "text-orange-600"
            }`}
          >
            Pro
          </div>
        )}
      </div>
    </Card>
  );
}
