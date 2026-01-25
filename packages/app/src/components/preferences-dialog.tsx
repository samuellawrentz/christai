"use client";

import {
  PREFERENCE_OPTIONS,
  type PreferenceOptionItem,
  type UserPreferences,
} from "@christianai/shared";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@christianai/ui";
import { useEffect, useState } from "react";

interface PreferencesDialogProps {
  open: boolean;
  initialPreferences?: UserPreferences;
  onSave: (preferences: UserPreferences) => Promise<void>;
  onCancel?: () => void;
  allowCancel?: boolean; // For profile page editing (non-blocking)
}

export function PreferencesDialog({
  open,
  initialPreferences = {},
  onSave,
  onCancel,
  allowCancel = false,
}: PreferencesDialogProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setPreferences(initialPreferences);
      setError(null);
    }
  }, [open, initialPreferences]);

  const isFormValid = preferences.pronouns && preferences.age_group && preferences.tone;

  const handleSave = async () => {
    if (!isFormValid) return;

    setSaving(true);
    setError(null);

    try {
      await onSave(preferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && allowCancel && onCancel?.()} modal>
      <DialogContent className="sm:max-w-[500px]" showCloseButton={allowCancel}>
        <DialogHeader>
          <DialogTitle>{allowCancel ? "Edit Preferences" : "Welcome to ChristianAI!"}</DialogTitle>
          <DialogDescription>
            {allowCancel
              ? "Update your preferences to personalize your conversations with biblical figures."
              : "Help us personalize your conversations with biblical figures by sharing a few preferences."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <div className="grid gap-2">
            <Label htmlFor="pronouns">
              Preferred Pronouns <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-1">How we'll address you in conversations</p>
            <Select
              value={preferences.pronouns || ""}
              onValueChange={(value) => updatePreference("pronouns", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pronouns" />
              </SelectTrigger>
              <SelectContent>
                {PREFERENCE_OPTIONS.pronouns.map((option: PreferenceOptionItem) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="age-group">
              Age Group <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-1">Adjusts vocabulary and concepts used</p>
            <Select
              value={preferences.age_group || ""}
              onValueChange={(value) => updatePreference("age_group", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {PREFERENCE_OPTIONS.age_group.map((option: PreferenceOptionItem) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tone">
              Conversation Tone <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-1">The style of conversation and responses</p>
            <Select
              value={preferences.tone || ""}
              onValueChange={(value) => updatePreference("tone", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select conversation tone" />
              </SelectTrigger>
              <SelectContent>
                {PREFERENCE_OPTIONS.tone.map((option: PreferenceOptionItem) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bible-translation">Preferred Bible Translation</Label>
            <p className="text-xs text-gray-500 mb-1">When referencing Scripture passages</p>
            <Select
              value={preferences.bible_translation || ""}
              onValueChange={(value) => updatePreference("bible_translation", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bible translation (optional)" />
              </SelectTrigger>
              <SelectContent>
                {PREFERENCE_OPTIONS.bible_translation.map((option: PreferenceOptionItem) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <p className="text-xs text-gray-500 mb-1">Choose your preferred theme</p>
            <Select
              value={preferences.theme || "system"}
              onValueChange={(value) => updatePreference("theme", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {PREFERENCE_OPTIONS.theme.map((option: PreferenceOptionItem) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          {allowCancel && (
            <Button variant="outline" disabled={saving} onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={!isFormValid || saving} className="min-w-[100px]">
            {saving ? "Saving..." : allowCancel ? "Save Changes" : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
