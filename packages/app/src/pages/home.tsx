import { Skeleton } from "@christianai/ui";
import { Sparkles } from "lucide-react";
import { FigureGrid } from "@/components/figures/figure-grid";
import { useFigures } from "@/hooks/use-figures";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/shared/hooks/use-auth";

export function HomePage() {
  const { data: figuresResponse, isLoading, error } = useFigures();
  const { data: subscription } = useSubscription();
  const { user } = useAuth();

  const figures = figuresResponse ?? [];
  const userHasPro = subscription?.data?.status === "active";

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <Skeleton className="h-8 w-80 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <h1 className="text-3xl mb-6 text-center">Who would you like to talk to today?</h1>
        <div className="text-center text-red-600">Failed to load figures. Please try again.</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3 mt-8">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-gray-100">
          Welcome back, {user?.email?.split("@")[0] || "friend"}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
          Explore biblical wisdom through meaningful conversations with historical figures
        </p>
      </div>

      {/* Figures Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-2 pt-8">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl text-gray-900 dark:text-gray-100">
            {"Start a New Conversation"}
          </h2>
        </div>
        <FigureGrid figures={figures} userHasPro={userHasPro} />
      </section>
    </main>
  );
}
