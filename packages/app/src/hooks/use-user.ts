import type { User, UserPreferences } from "@christianai/shared/types/api/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../lib/api";
import { useAuth } from "../shared/hooks/use-auth";

export const USER_QUERY_KEY = ["user", "me"] as const;

export const useUser = () => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user data
  const query = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => usersApi.getMe(),
    enabled: !!authUser,
  });

  // Mutation for updating preferences
  const updateMutation = useMutation({
    mutationFn: (preferences: UserPreferences) => usersApi.updatePreferences(preferences),
    onSuccess: (updatedUser) => {
      // Update cache with the new user data
      queryClient.setQueryData(USER_QUERY_KEY, updatedUser);
    },
  });

  return {
    user: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    updatePreferences: updateMutation.mutateAsync,
    isSaving: updateMutation.isPending,
    saveError: updateMutation.error,
  };
};
