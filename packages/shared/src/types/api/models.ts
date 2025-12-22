import type { APIResponse } from "./response";

export type User = {
  id: string;
  email: string;
};

export type WaitlistEntry = {
  email: string;
  source?: string;
};

export type WaitlistInsert = Omit<WaitlistEntry, "id">;

// Add more domain models here as the app grows
// export type Chat = { ... }
// export type Message = { ... }
// export type BibleVerse = { ... }

// Response types for specific endpoints
export type WaitlistResponse = APIResponse<{ success: boolean }>;

// Add more response types as needed
// export type ChatResponse = APIResponse<Chat>
// export type MessageResponse = APIResponse<Message>
