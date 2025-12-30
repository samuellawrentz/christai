export const PREFERENCE_OPTIONS = {
  pronouns: [
    { value: "he/him", label: "He/Him" },
    { value: "she/her", label: "She/Her" },
    { value: "they/them", label: "They/Them" },
  ] as const,
  age_group: [
    { value: "child", label: "Child (simpler language)" },
    { value: "teen", label: "Teenager (relatable examples)" },
    { value: "adult", label: "Adult (deeper concepts)" },
    { value: "senior", label: "Senior (thoughtful approach)" },
  ] as const,
  tone: [
    { value: "formal", label: "Formal & Reverent" },
    { value: "conversational", label: "Conversational & Approachable" },
    { value: "warm", label: "Warm & Nurturing" },
  ] as const,
  bible_translation: [
    { value: "NIV", label: "NIV (New International Version)" },
    { value: "ESV", label: "ESV (English Standard Version)" },
    { value: "KJV", label: "KJV (King James Version)" },
    { value: "NLT", label: "NLT (New Living Translation)" },
    { value: "MSG", label: "MSG (The Message)" },
  ] as const,
  theme: [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ] as const,
} as const;

export type PreferenceOption = typeof PREFERENCE_OPTIONS;
export type PreferenceKey = keyof PreferenceOption;
export type PreferenceOptionItem = (typeof PREFERENCE_OPTIONS)[PreferenceKey][number];
