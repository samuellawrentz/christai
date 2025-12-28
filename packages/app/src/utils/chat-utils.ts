import type { Conversation } from "@christianai/shared";
import dayjs from "dayjs";
import { groupBy } from "lodash";

export function groupConversationsByDate(conversations: Conversation[]) {
  const now = dayjs();
  const today = now.startOf("day");
  const yesterday = now.subtract(1, "day").startOf("day");

  const groupedByKey = groupBy(conversations, (conversation) => {
    const date = dayjs(conversation.updated_at).startOf("day");

    if (date.isSame(today, "day")) {
      return "Today";
    } else if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    } else {
      return date.format("MMM D, YYYY");
    }
  });

  return groupedByKey;
}
