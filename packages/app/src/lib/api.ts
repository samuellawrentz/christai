import { supabase } from "./supabase";

// API utility for making authenticated requests to your backend
const baseUrl = import.meta.env.VITE_API_URL || "https://api.christianai.world";

async function authenticatedRequest(endpoint: string, options: RequestInit = {}) {
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
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API request failed: ${response.statusText}`);
  }

  return response.json();
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
  list: () => authenticatedRequest("/figures"),
};

export const conversationsApi = {
  list: () => authenticatedRequest("/conversations"),
  get: (id: string) => authenticatedRequest(`/conversations/${id}`),
  create: (figureId: number) =>
    authenticatedRequest("/conversations", {
      method: "POST",
      body: JSON.stringify({ figure_id: figureId }),
    }),
  getMessages: (conversationId: string) =>
    authenticatedRequest(`/conversations/${conversationId}/messages`),
};
