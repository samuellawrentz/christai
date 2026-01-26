import { Input, Skeleton } from "@christianai/ui";
import { useState } from "react";
import { FigureGrid } from "@/components/figures/figure-grid";
import { useFigures } from "@/hooks/use-figures";
import { useSubscription } from "@/hooks/use-subscription";

export function FiguresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: figures, isLoading, error } = useFigures();
  const { data: subscription } = useSubscription();

  const userHasPro = subscription?.data?.status === "pro";

  const filteredFigures =
    figures?.filter((figure) =>
      figure.display_name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-10 w-full mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <h1 className="text-3xl font-bold mb-6">Biblical Figures</h1>
        <div className="text-center text-red-600">Failed to load figures. Please try again.</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <h1 className="text-3xl font-bold mb-6">Biblical Figures</h1>
      <Input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6"
      />
      <FigureGrid figures={filteredFigures} userHasPro={userHasPro} />
    </main>
  );
}
