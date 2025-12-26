import type { UserPreferences } from "@christianai/shared/types/api/models";
import { useUser } from "./use-user";

export const usePreferences = () => {
  const { user, loading, updatePreferences, isSaving } = useUser();

  // Check if user has ALL preferences set
  const hasPreferences = !!(
    user?.preferences?.pronouns &&
    user?.preferences?.age_group &&
    user?.preferences?.tone
  );

  const savePreferences = async (preferences: UserPreferences) => {
    try {
      await updatePreferences(preferences);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    hasPreferences,
    savePreferences,
    saving: isSaving,
  };
};
