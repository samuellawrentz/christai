import type { Message } from "@christianai/shared/types/api/models";
import type { UIMessage } from "ai";

export function convertToUIMessages(dbMessages: Message[]): UIMessage[] {
  return dbMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    parts: [
      {
        type: "text" as const,
        text: msg.content,
        state: "done" as const,
      },
    ],
  }));
}
