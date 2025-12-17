import type { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { create } from "zustand";
import { supabase } from "../../lib/supabase";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setAuth: (user: User | null, loading?: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  setAuth: (user, loading = false) => set({ user, loading, initialized: true }),
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data.user) {
      set({ user: data.user });
    }
    return { error };
  },
  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      set({ user: null });
    }
    return { error };
  },
}));

// Hook to initialize auth state (call once in app root)
export const useInitAuth = () => {
  const { setAuth, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuth(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [initialized, setAuth]);
};

// Main hook to use in components
export const useAuth = () => {
  const { user, loading, signIn, signUp, signOut } = useAuthStore();

  return {
    user,
    loading,
    userAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
};
