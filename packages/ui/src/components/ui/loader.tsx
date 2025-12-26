import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 20,
  md: 32,
  lg: 48,
};

export function Loader({ size = "md", text, className }: LoaderProps) {
  return (
    <div className={cn("flex min-h-screen items-center justify-center", className)}>
      <div className="text-center">
        <Loader2 size={sizeClasses[size]} className="mx-auto mb-4 animate-spin" />
        {text && <p className="text-gray-600">{text}</p>}
      </div>
    </div>
  );
}
