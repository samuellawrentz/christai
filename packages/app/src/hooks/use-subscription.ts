// Stub hook for subscription status
// TODO: Implement when subscription API is ready
import { useQuery } from "@tanstack/react-query";

export function useSubscription() {
  // For now, assume user doesn't have pro
  // This will be replaced with actual API call when subscription system is implemented
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => Promise.resolve({ data: { status: "free" } }),
    staleTime: 60 * 1000, // 1 minute
  });
}
