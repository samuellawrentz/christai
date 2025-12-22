import type { APIResponse } from "./response";

export type User = {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  preferences?: Record<string, any>;
};

export type Figure = {
  id: number;
  slug: string;
  display_name: string;
  description?: string;
  avatar_url?: string;
  category?: string;
  is_active: boolean;
  requires_pro: boolean;
  popularity_score: number;
  created_at: string;
};

export type Plan = {
  id: number;
  slug: string;
  name: string;
  price_monthly?: number;
  price_yearly?: number;
  message_limit?: number;
  chat_retention_days: number;
  is_active: boolean;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: number;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  figure_id: number;
  title?: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  message_count: number;
  is_deleted: boolean;
  figures?: {
    id: number;
    display_name: string;
    avatar_url?: string;
  };
};

export type Message = {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  token_count?: number;
  feedback?: Record<string, any>;
};

export type WaitlistEntry = {
  email: string;
  source?: string;
};

export type WaitlistInsert = Omit<WaitlistEntry, "id">;

// Request types
export type CreateConversationRequest = {
  figure_id: number;
  title?: string;
};

export type SendMessageRequest = {
  content: string;
};

// Response types for specific endpoints
export type WaitlistResponse = APIResponse<{ success: boolean }>;
export type FiguresResponse = APIResponse<Figure[]>;
export type ConversationsResponse = APIResponse<Conversation[]>;
export type ConversationResponse = APIResponse<Conversation>;
export type MessagesResponse = APIResponse<Message[]>;
export type MessageResponse = APIResponse<Message>;
export type UserResponse = APIResponse<User>;
