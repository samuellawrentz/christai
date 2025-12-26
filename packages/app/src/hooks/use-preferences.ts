import type { User, UserPreferences } from "@christianai/shared/types/api/models";
import { useEffect, useState } from "react";
import { usersApi } from "../lib/api";
import { useAuth } from "../shared/hooks/use-auth";

export const usePreferences = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    if (authUser) {
      setLoading(true);
      usersApi
        .getMe()
        .then(setUser)
        .catch((error) => {
          console.error("Failed to fetch user preferences:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [authUser]);

  // Check if user has ALL preferences set
  const hasPreferences = !!(
    user?.preferences?.pronouns &&
    user?.preferences?.age_group &&
    user?.preferences?.tone
  );

  const savePreferences = async (preferences: UserPreferences) => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedUser = await usersApi.updatePreferences(preferences);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    loading,
    hasPreferences,
    savePreferences,
    saving,
  };
};
