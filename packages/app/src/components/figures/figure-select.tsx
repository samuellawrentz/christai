import type { Figure } from "@christianai/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@christianai/ui";

interface FigureSelectDropdownProps {
  figures: Figure[];
  value: string;
  onValueChange: (slug: string) => void;
  className?: string;
}

export function FigureSelectDropdown({
  figures,
  value,
  onValueChange,
  className,
}: FigureSelectDropdownProps) {
  const selectedFigure = figures.find((f) => f.slug === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(className)}>
        {selectedFigure ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedFigure.avatar_url} />
              <AvatarFallback>{selectedFigure.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{selectedFigure.display_name}</span>
          </div>
        ) : (
          <SelectValue placeholder="Select a figure" />
        )}
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4}>
        {figures.map((figure) => (
          <SelectItem key={figure.slug} value={figure.slug}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={figure.avatar_url} />
                <AvatarFallback>{figure.display_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{figure.display_name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
