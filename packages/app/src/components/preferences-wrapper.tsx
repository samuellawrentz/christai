"use client";

import type { UserPreferences } from "@christianai/shared";
import { Loader } from "@christianai/ui";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { usePreferences } from "../hooks/use-preferences";
import { PreferencesDialog } from "./preferences-dialog";

export function PreferencesWrapper() {
  const { hasPreferences, loading, savePreferences, user } = usePreferences();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Manage dialog state based on loading and preferences status
  useEffect(() => {
    if (!loading) {
      setDialogOpen(!hasPreferences);
    }
  }, [loading, hasPreferences]);

  const handleSave = async (preferences: UserPreferences) => {
    await savePreferences(preferences);
    // Dialog will close automatically when hasPreferences becomes true
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <PreferencesDialog
        open={dialogOpen}
        initialPreferences={user?.preferences || {}}
        onSave={handleSave}
        allowCancel={false} // Blocking dialog for onboarding
      />
    </>
  );
}
