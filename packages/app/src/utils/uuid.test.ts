import { describe, expect, test } from "bun:test";
import { isUUID } from "./uuid";

describe("isUUID", () => {
  test("returns true for valid v4 UUID", () => {
    expect(isUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
  });

  test("returns true for generated UUIDs", () => {
    const uuid = crypto.randomUUID();
    expect(isUUID(uuid)).toBe(true);
  });

  test("returns false for invalid UUIDs", () => {
    expect(isUUID("not-a-uuid")).toBe(false);
    expect(isUUID("12345")).toBe(false);
    expect(isUUID("")).toBe(false);
  });

  test("returns false for UUID-like but malformed strings", () => {
    expect(isUUID("550e8400-e29b-41d4-a716")).toBe(false); // Too short
    expect(isUUID("550e8400-e29b-41d4-a716-446655440000-extra")).toBe(false); // Too long
    expect(isUUID("550e8400e29b41d4a716446655440000")).toBe(false); // No dashes
  });

  test("returns false for non-string values coerced to strings", () => {
    // @ts-expect-error testing runtime behavior
    expect(isUUID(null)).toBe(false);
    // @ts-expect-error testing runtime behavior
    expect(isUUID(undefined)).toBe(false);
  });
});
