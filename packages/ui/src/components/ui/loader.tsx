import { cn } from "../../lib/utils";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function Loader({ size = "md", text, className }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100",
        className,
      )}
    >
      <div className="text-center">
        <div
          className={cn(
            "mx-auto mb-4 animate-spin rounded-full border-blue-600 border-b-2",
            sizeClasses[size],
          )}
        />
        {text && <p className="text-gray-600">{text}</p>}
      </div>
    </div>
  );
}
