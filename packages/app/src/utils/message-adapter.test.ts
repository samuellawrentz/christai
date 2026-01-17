import { describe, expect, test } from "bun:test";
import type { Message } from "@christianai/shared/types/api/models";
import { convertToUIMessages } from "./message-adapter";

const createMessage = (overrides: Partial<Message> = {}): Message => ({
  id: crypto.randomUUID(),
  conversation_id: "conv-1",
  user_id: "user-1",
  role: "user",
  content: "Hello world",
  timestamp: new Date().toISOString(),
  ...overrides,
});

describe("convertToUIMessages", () => {
  test("converts single message correctly", () => {
    const messages = [createMessage({ id: "msg-1", role: "user", content: "Hi" })];

    const result = convertToUIMessages(messages);

    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("msg-1");
    expect(result[0]!.role).toBe("user");
    expect(result[0]!.parts).toEqual([{ type: "text", text: "Hi", state: "done" }]);
  });

  test("converts multiple messages preserving order", () => {
    const messages = [
      createMessage({ id: "1", role: "user", content: "Question" }),
      createMessage({ id: "2", role: "assistant", content: "Answer" }),
      createMessage({ id: "3", role: "user", content: "Follow up" }),
    ];

    const result = convertToUIMessages(messages);

    expect(result).toHaveLength(3);
    expect(result[0]!.role).toBe("user");
    expect(result[1]!.role).toBe("assistant");
    expect(result[2]!.role).toBe("user");
  });

  test("handles system role", () => {
    const messages = [createMessage({ role: "system", content: "System prompt" })];

    const result = convertToUIMessages(messages);

    expect(result[0]!.role).toBe("system");
  });

  test("handles empty content", () => {
    const messages = [createMessage({ content: "" })];

    const result = convertToUIMessages(messages);

    const firstPart = result[0]!.parts[0]!;
    expect("text" in firstPart && firstPart.text).toBe("");
  });

  test("returns empty array for empty input", () => {
    const result = convertToUIMessages([]);
    expect(result).toEqual([]);
  });

  test("preserves message IDs", () => {
    const messages = [createMessage({ id: "uuid-1" }), createMessage({ id: "uuid-2" })];

    const result = convertToUIMessages(messages);

    expect(result[0]!.id).toBe("uuid-1");
    expect(result[1]!.id).toBe("uuid-2");
  });
});
