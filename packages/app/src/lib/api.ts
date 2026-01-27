import type {
  Conversation,
  Figure,
  Message,
  User,
  UserPreferences,
} from "@christianai/shared/types/api/models";
import { APIError } from "./query-client";
import { supabase } from "./supabase";

// API utility for making authenticated requests to your backend
const baseUrl = import.meta.env.VITE_API_URL || "https://api.christianai.world";

async function authenticatedRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error("No authentication token available");
  }

  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - logout and redirect to signin
    if (response.status === 401) {
      await supabase.auth.signOut();
      window.location.href = "/";
      throw new APIError("Session expired. Please sign in again.", 401);
    }

    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new APIError(
      errorData.message || `API request failed: ${response.statusText}`,
      response.status,
    );
  }

  const apiResponse = await response.json();
  return apiResponse.data;
}

// Legacy API methods (for backwards compatibility)
export const api = {
  baseUrl,

  async request(endpoint: string, options: RequestInit = {}) {
    return authenticatedRequest(endpoint, options);
  },

  async get(endpoint: string) {
    return authenticatedRequest(endpoint);
  },

  async post(endpoint: string, data: unknown) {
    return authenticatedRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async health() {
    return this.get("/health");
  },
};

// React Query API functions
export const figuresApi = {
  list: () => authenticatedRequest<Figure[]>("/figures"),
  getBySlug: (slug: string) => authenticatedRequest<Figure>(`/figures/${slug}`),
};

export const conversationsApi = {
  list: () => authenticatedRequest<Conversation[]>("/conversations"),
  get: (id: string) => authenticatedRequest<Conversation>(`/conversations/${id}`),
  create: (figureId: number) =>
    authenticatedRequest<Conversation>("/conversations", {
      method: "POST",
      body: JSON.stringify({ figure_id: figureId }),
    }),
  getMessages: (conversationId: string) =>
    authenticatedRequest<Message[]>(`/conversations/${conversationId}/messages`),
  delete: (id: string) =>
    authenticatedRequest<void>(`/conversations/${id}`, {
      method: "DELETE",
    }),
  updateTitle: (id: string, title: string) =>
    authenticatedRequest<Conversation>(`/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
  toggleBookmark: (id: string) =>
    authenticatedRequest<Conversation>(`/conversations/${id}/bookmark`, {
      method: "PATCH",
    }),
  createShare: (id: string) =>
    authenticatedRequest<{ share_token: string; share_url: string }>(`/conversations/${id}/share`, {
      method: "POST",
    }),
};

export const usersApi = {
  getMe: () => authenticatedRequest<User>("/users/me"),
  updatePreferences: (preferences: UserPreferences) =>
    authenticatedRequest<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ preferences }),
    }),
};
