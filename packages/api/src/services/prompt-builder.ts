import fs from "node:fs";
import path from "node:path";
import type { UserPreferences } from "@christianai/shared/types/api/models";

// Cache for prompts to avoid repeated file reads
let globalPromptCache: string | null = null;
const figurePromptCache = new Map<string, string>();

/**
 * Loads the global prompt (cached after first load)
 */
function loadGlobalPrompt(): string {
  if (globalPromptCache) return globalPromptCache;

  const promptPath = path.join(process.cwd(), "src", "prompts", "global.md");
  try {
    globalPromptCache = fs.readFileSync(promptPath, "utf-8");
    return globalPromptCache;
  } catch (_error) {
    // Fallback if file not found
    return "Speak with wisdom, compassion, and biblical accuracy.";
  }
}

/**
 * Loads a figure-specific prompt (cached after first load)
 */
function loadFigurePrompt(slug: string, displayName: string, description: string): string {
  if (figurePromptCache.has(slug)) {
    return figurePromptCache.get(slug)!;
  }

  const promptPath = path.join(process.cwd(), "src", "prompts", "figures", `${slug}.md`);
  try {
    const prompt = fs.readFileSync(promptPath, "utf-8");
    figurePromptCache.set(slug, prompt);
    return prompt;
  } catch (_error) {
    // Fallback if file not found
    return `You are ${displayName}. ${description} Speak with wisdom and compassion.`;
  }
}

/**
 * Builds user preferences section of prompt
 */
function buildUserPreferencesPrompt(preferences: UserPreferences = {}): string {
  const parts: string[] = [];

  // Pronouns
  const pronouns = preferences.pronouns || "they/them";
  parts.push(`The user prefers ${pronouns} pronouns. Address them accordingly.`);

  // Age group
  const ageGroup: "child" | "teen" | "adult" | "senior" = preferences.age_group || "adult";
  const ageInstructions: Record<"child" | "teen" | "adult" | "senior", string> = {
    child:
      "The user is a child. Use simple vocabulary, short clear explanations, focus on God's love and basic biblical truths. Avoid complex theology and mature themes.",
    teen: "The user is a teenager. Use age-appropriate language with relatable examples and encourage spiritual growth.",
    adult:
      "The user is an adult. Use mature language and explore deeper theological concepts when appropriate.",
    senior:
      "The user is a senior. Use thoughtful, respectful language with patience and wisdom from experience.",
  };
  parts.push(ageInstructions[ageGroup]);

  // Tone
  const tone: "formal" | "conversational" | "warm" = preferences.tone || "conversational";
  const toneInstructions: Record<"formal" | "conversational" | "warm", string> = {
    formal: "Maintain a formal, reverent tone in all responses.",
    conversational: "Use a conversational, approachable tone while maintaining respect.",
    warm: "Use a warm, nurturing tone that shows care and compassion.",
  };
  parts.push(toneInstructions[tone]);

  // Bible translation preference
  if (preferences.bible_translation) {
    parts.push(
      `When referencing Scripture, prefer the ${preferences.bible_translation} translation when appropriate.`,
    );
  }

  return parts.join("\n");
}

/**
 * Builds the complete system prompt
 */
export function buildSystemPrompt(
  figureSlug: string,
  figureDisplayName: string,
  figureDescription: string,
  userPreferences?: UserPreferences,
): string {
  const parts: string[] = [];

  // 1. Figure-specific prompt
  parts.push(loadFigurePrompt(figureSlug, figureDisplayName, figureDescription));

  // 2. Global prompt
  parts.push("\n---\n");
  parts.push(loadGlobalPrompt());

  // 3. User preferences prompt
  if (userPreferences && Object.keys(userPreferences).length > 0) {
    parts.push("\n---\n");
    parts.push("## User Preferences");
    parts.push(buildUserPreferencesPrompt(userPreferences));
  }

  return parts.join("\n");
}
