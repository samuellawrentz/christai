import type { Conversation, Figure } from "@christianai/shared/types/api/models";
import { Badge, Card, Skeleton } from "@christianai/ui";
import { Crown, MessageCircle, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FigureGrid } from "@/components/figures/figure-grid";
import { useConversations } from "@/hooks/use-conversations";
import { useFigures } from "@/hooks/use-figures";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/shared/hooks/use-auth";

export function HomePage() {
  const { data: figuresResponse, isLoading, error } = useFigures();
  const { data: subscription } = useSubscription();
  const { data: conversationsResponse } = useConversations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const figures = figuresResponse ?? [];
  const conversations = conversationsResponse ?? [];
  const userHasPro = subscription?.data?.status === "active";

  const recentConversations = conversations.slice(0, 3);

  const filteredFigures = useMemo(() => {
    if (!searchQuery.trim()) return figures;
    const query = searchQuery.toLowerCase();
    return figures.filter(
      (f: Figure) =>
        f.display_name.toLowerCase().includes(query) ||
        f.description?.toLowerCase().includes(query),
    );
  }, [figures, searchQuery]);

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
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900">
          Welcome back, {user?.email?.split("@")[0] || "friend"}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore biblical wisdom through meaningful conversations with historical figures
        </p>
      </div>

      {/* Subscription Upsell for Free Users */}
      {/* {!userHasPro && ( */}
      {/*   <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 p-6"> */}
      {/*     <div className="flex items-start gap-4"> */}
      {/*       <div className="p-3 bg-blue-600 rounded-lg"> */}
      {/*         <Crown className="w-6 h-6 text-white" /> */}
      {/*       </div> */}
      {/*       <div className="flex-1"> */}
      {/*         <h3 className="text-xl font-semibold text-gray-900 mb-2"> */}
      {/*           Unlock Premium Figures with Pro */}
      {/*         </h3> */}
      {/*         <p className="text-gray-700 mb-4"> */}
      {/*           Get access to exclusive biblical figures and unlimited conversations */}
      {/*         </p> */}
      {/*         <button */}
      {/*           type="button" */}
      {/*           onClick={() => navigate("/profile")} */}
      {/*           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" */}
      {/*         > */}
      {/*           Upgrade to Pro */}
      {/*         </button> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </Card> */}
      {/* )} */}

      {/* Search Bar - only show if no conversations */}
      {conversations.length === 0 && (
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search biblical figures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
      )}

      {/* Figures Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-2 pt-8">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl text-gray-900">
            {searchQuery ? "Search Results" : "Start a New Conversation"}
          </h2>
          {searchQuery && <Badge variant="secondary">{filteredFigures.length} found</Badge>}
        </div>
        {filteredFigures.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No figures found matching "{searchQuery}"
          </div>
        ) : (
          <FigureGrid figures={filteredFigures} userHasPro={userHasPro} />
        )}
      </section>
    </main>
  );
}
