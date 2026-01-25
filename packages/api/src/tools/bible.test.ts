import { describe, expect, test } from "bun:test";
import { createBibleTools } from "./bible";

describe("Bible Tools", () => {
  const tools = createBibleTools("kjv");

  // Mock execution options for testing
  const mockOptions = {
    toolCallId: "test-call-id",
    messages: [],
    abortSignal: undefined,
  };

  test("should create all three tools", () => {
    expect(tools.getBibleVerse).toBeDefined();
    expect(tools.searchBible).toBeDefined();
    expect(tools.getRandomVerse).toBeDefined();
  });

  test("getBibleVerse should fetch John 3:16", async () => {
    const result = (await tools.getBibleVerse.execute!(
      { reference: "John 3:16" },
      mockOptions,
    )) as any;
    expect(result).toHaveProperty("reference");
    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("translation");
    expect(result.text).toContain("God");
  });

  test("searchBible should find verses about love", async () => {
    const result = (await tools.searchBible.execute!({ query: "love" }, mockOptions)) as any;
    expect(result).toHaveProperty("results");
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results.length).toBeGreaterThan(0);
  });

  test("getRandomVerse should return a verse", async () => {
    const result = (await tools.getRandomVerse.execute!({}, mockOptions)) as any;
    expect(result).toHaveProperty("reference");
    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("translation");
  });

  test("should handle invalid verse reference gracefully", async () => {
    const result = (await tools.getBibleVerse.execute!(
      { reference: "InvalidBook 999:999" },
      mockOptions,
    )) as any;
    expect(result).toHaveProperty("error");
    expect(result.error).toBe(true);
  });
});
