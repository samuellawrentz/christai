import { tool } from "ai";
import { z } from "zod";
import { log } from "../libs/logger";
import type { BibleVerseResponse, BollsSearchResponse } from "./types";

const BIBLE_API_TIMEOUT = 5000;

// Helper to fetch with timeout
async function fetchWithTimeout(url: string, timeout = BIBLE_API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// Map user-friendly names to API codes
function normalizeTranslation(translation?: string): string {
  const map: Record<string, string> = {
    NIV: "web", // NIV not available, fallback to WEB
    ESV: "web", // ESV not available, fallback to WEB
    KJV: "kjv",
    NLT: "web", // NLT not available, fallback to WEB
    MSG: "web", // MSG not available, fallback to WEB
  };
  if (!translation) return "kjv";
  return map[translation.toUpperCase()] || translation.toLowerCase();
}

export const createBibleTools = (userTranslation?: string) => {
  const defaultTranslation = normalizeTranslation(userTranslation) || "kjv";

  return {
    getBibleVerse: tool({
      description:
        "Fetch a Bible verse or passage by reference. Use when citing scripture or when user asks for a specific verse.",
      inputSchema: z.object({
        reference: z
          .string()
          .describe('Bible reference like "John 3:16" or "Romans 8:28-39" or "Psalm 23"'),
      }),
      execute: async (input) => {
        const startTime = Date.now();
        log.tools.info("getBibleVerse called", {
          reference: input.reference,
          translation: defaultTranslation,
        });

        try {
          const url = `https://bible-api.com/${encodeURIComponent(input.reference)}?translation=${defaultTranslation}`;
          const res = await fetchWithTimeout(url);

          if (!res.ok) {
            log.tools.warn("getBibleVerse not found", {
              reference: input.reference,
              status: res.status,
            });
            return { error: true, message: `Could not find verse: ${input.reference}` };
          }

          const data = (await res.json()) as BibleVerseResponse;
          log.tools.info("getBibleVerse success", {
            reference: data.reference,
            durationMs: Date.now() - startTime,
          });
          return {
            reference: data.reference,
            text: data.text,
            translation: data.translation_name || defaultTranslation.toUpperCase(),
          };
        } catch (error) {
          log.tools.error("getBibleVerse failed", {
            reference: input.reference,
            error: String(error),
          });
          return { error: true, message: `Failed to fetch verse: ${input.reference}` };
        }
      },
    }),

    searchBible: tool({
      description:
        "Search Bible for verses containing specific words or phrases. Use when looking for verses about a topic.",
      inputSchema: z.object({
        query: z
          .string()
          .describe('Search terms like "love neighbor" or "faith hope" or "forgiveness"'),
      }),
      execute: async (input) => {
        const startTime = Date.now();
        log.tools.info("searchBible called", {
          query: input.query,
          translation: defaultTranslation,
        });

        try {
          // bolls.life uses uppercase translation codes
          const translation = defaultTranslation.toUpperCase();
          const url = `https://bolls.life/v2/find/${translation}?search=${encodeURIComponent(input.query)}&limit=5`;
          const res = await fetchWithTimeout(url);

          if (!res.ok) {
            log.tools.warn("searchBible failed", { query: input.query, status: res.status });
            return { error: true, message: `Search failed for: ${input.query}` };
          }

          const data = (await res.json()) as BollsSearchResponse;
          log.tools.info("searchBible success", {
            query: input.query,
            resultCount: data.results.length,
            durationMs: Date.now() - startTime,
          });
          return {
            query: input.query,
            results: data.results.map((v) => ({
              reference: `${v.book}:${v.chapter}:${v.verse}`,
              text: v.text
                .replace(/<[^>]*>/g, "") // Strip HTML tags
                .replace(/<S>\d+<\/S>/g, "") // Strip Strong's numbers
                .replace(/\d{1,5}(?!\d)/g, "") // Strip remaining Strong's numbers
                .replace(/\s+/g, " ") // Normalize whitespace
                .trim(),
            })),
            translation: translation,
          };
        } catch (error) {
          log.tools.error("searchBible failed", { query: input.query, error: String(error) });
          return { error: true, message: `Search failed for: ${input.query}` };
        }
      },
    }),

    getRandomVerse: tool({
      description:
        "Get a random Bible verse for inspiration, encouragement, or when starting a conversation.",
      inputSchema: z.object({}),
      execute: async () => {
        const startTime = Date.now();
        log.tools.info("getRandomVerse called", { translation: defaultTranslation });

        try {
          const url = `https://bible-api.com/data/${defaultTranslation}/random`;
          const res = await fetchWithTimeout(url);

          if (!res.ok) {
            log.tools.warn("getRandomVerse failed", { status: res.status });
            return { error: true, message: "Could not get random verse" };
          }

          const data = (await res.json()) as BibleVerseResponse;
          log.tools.info("getRandomVerse success", {
            reference: data.reference,
            durationMs: Date.now() - startTime,
          });
          return {
            reference: data.reference,
            text: data.text,
            translation: data.translation_name || defaultTranslation.toUpperCase(),
          };
        } catch (error) {
          log.tools.error("getRandomVerse failed", { error: String(error) });
          return { error: true, message: "Could not get random verse" };
        }
      },
    }),
  };
};
