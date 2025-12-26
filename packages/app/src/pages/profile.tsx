"use client";

import { PREFERENCE_OPTIONS, type PreferenceOptionItem } from "@christianai/shared";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@christianai/ui";
import { useState } from "react";
import { toast } from "sonner";
import { PreferencesDialog } from "../components/preferences-dialog";
import { usePreferences } from "../hooks/use-preferences";

export function ProfilePage() {
  const { user, savePreferences } = usePreferences();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = async (preferences: any) => {
    try {
      await savePreferences(preferences);
      setDialogOpen(false);
      toast.success("Preferences updated successfully!");
    } catch (error) {
      toast.error("Failed to update preferences");
      throw error; // Re-throw to let dialog handle error state
    }
  };

  const formatPreferenceValue = (key: string, value: string | undefined) => {
    if (!value) return "Not set";

    const option = PREFERENCE_OPTIONS[key as keyof typeof PREFERENCE_OPTIONS]?.find(
      (opt: PreferenceOptionItem) => opt.value === value,
    );

    return option?.label || value;
  };

  return (
    <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <h1 className="text-3xl font-serif mb-6">Profile</h1>

      <div className="space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Email:</span> {user?.email}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Preferences</CardTitle>
            <CardDescription>
              These preferences help personalize your conversations with biblical figures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Preferred Pronouns:</span>{" "}
                  {formatPreferenceValue("pronouns", user?.preferences?.pronouns)}
                </div>
                <div>
                  <span className="font-medium">Age Group:</span>{" "}
                  {formatPreferenceValue("age_group", user?.preferences?.age_group)}
                </div>
                <div>
                  <span className="font-medium">Conversation Tone:</span>{" "}
                  {formatPreferenceValue("tone", user?.preferences?.tone)}
                </div>
                <div>
                  <span className="font-medium">Bible Translation:</span>{" "}
                  {formatPreferenceValue("bible_translation", user?.preferences?.bible_translation)}
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={() => setDialogOpen(true)}>Edit Preferences</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PreferencesDialog
        open={dialogOpen}
        initialPreferences={user?.preferences || {}}
        onSave={handleSave}
        allowCancel={true}
      />
    </main>
  );
}
