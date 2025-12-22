import { useQuery } from "@tanstack/react-query";
import { figuresApi } from "@/lib/api";

export function useFigures() {
  return useQuery({
    queryKey: ["figures"],
    queryFn: figuresApi.list,
    staleTime: 5 * 60 * 1000, // 5 minutes (figures rarely change)
  });
}
