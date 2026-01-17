import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { Conversation } from "@christianai/shared";
import { groupConversationsByDate } from "./chat-utils";

const createConversation = (updated_at: string): Conversation =>
  ({
    id: crypto.randomUUID(),
    user_id: "user-1",
    figure_id: 1,
    created_at: updated_at,
    updated_at,
  }) as Conversation;

describe("groupConversationsByDate", () => {
  let originalDate: typeof Date;

  beforeEach(() => {
    // Mock current date to 2024-06-15 12:00:00
    originalDate = globalThis.Date;
    const mockDate = new Date("2024-06-15T12:00:00Z");

    const MockDate = class extends Date {
      constructor(value?: string | number | Date) {
        if (value === undefined) {
          super(mockDate);
        } else {
          super(value);
        }
      }
      static override now() {
        return mockDate.getTime();
      }
    };
    globalThis.Date = MockDate as typeof Date;
  });

  afterEach(() => {
    globalThis.Date = originalDate;
  });

  test("groups conversations from today", () => {
    const conversations = [
      createConversation("2024-06-15T10:00:00Z"),
      createConversation("2024-06-15T08:00:00Z"),
    ];

    const result = groupConversationsByDate(conversations);

    expect(result.Today).toBeDefined();
    expect(result.Today!.length).toBe(2);
  });

  test("groups conversations from yesterday", () => {
    const conversations = [
      createConversation("2024-06-14T15:00:00Z"),
      createConversation("2024-06-14T09:00:00Z"),
    ];

    const result = groupConversationsByDate(conversations);

    expect(result.Yesterday).toBeDefined();
    expect(result.Yesterday!.length).toBe(2);
  });

  test("groups older conversations by formatted date", () => {
    const conversations = [
      createConversation("2024-06-10T12:00:00Z"),
      createConversation("2024-06-10T10:00:00Z"),
      createConversation("2024-05-20T12:00:00Z"),
    ];

    const result = groupConversationsByDate(conversations);

    expect(result["Jun 10, 2024"]).toBeDefined();
    expect(result["Jun 10, 2024"]!.length).toBe(2);
    expect(result["May 20, 2024"]).toBeDefined();
    expect(result["May 20, 2024"]!.length).toBe(1);
  });

  test("handles mixed dates correctly", () => {
    const conversations = [
      createConversation("2024-06-15T10:00:00Z"), // Today
      createConversation("2024-06-14T10:00:00Z"), // Yesterday
      createConversation("2024-06-01T10:00:00Z"), // Older
    ];

    const result = groupConversationsByDate(conversations);

    expect(result.Today?.length).toBe(1);
    expect(result.Yesterday?.length).toBe(1);
    expect(result["Jun 1, 2024"]?.length).toBe(1);
  });

  test("returns empty object for empty array", () => {
    const result = groupConversationsByDate([]);
    expect(Object.keys(result).length).toBe(0);
  });
});
