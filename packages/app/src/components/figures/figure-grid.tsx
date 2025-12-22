import type { Figure } from "@christianai/shared/types/api/models";
import { FigureCard } from "./figure-card";

type Props = {
  figures: Figure[];
  userHasPro: boolean;
};

export function FigureGrid({ figures, userHasPro }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {figures.map((figure) => (
        <FigureCard key={figure.id} figure={figure} userHasPro={userHasPro} />
      ))}
    </div>
  );
}
