import { useFigures } from "@/hooks/use-figures";
import { useSubscription } from "@/hooks/use-subscription";
import { Skeleton } from "@christianai/ui";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { FigureGrid } from "@/components/figures/figure-grid";
import type { Figure } from "@christianai/shared/types/api/models";

export function HomePage() {
  const { data: figuresResponse, isLoading, error } = useFigures();
  const { data: subscription } = useSubscription();

  const figures = figuresResponse?.data ?? [];
  const userHasPro = subscription?.data?.status === "active";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E6]">
        <AppHeader />
        <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
          <Skeleton className="h-8 w-80 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F0E6]">
        <AppHeader />
        <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
          <h1 className="text-3xl font-serif mb-6">Who would you like to talk to today?</h1>
          <div className="text-center text-red-600">Failed to load figures. Please try again.</div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <h1 className="text-3xl font-serif mb-6">Who would you like to talk to today?</h1>
        <FigureGrid figures={figures} userHasPro={userHasPro} />
      </main>
      <BottomNav />
    </div>
  );
}
