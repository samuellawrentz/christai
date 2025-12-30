import type { UserPreferences } from "@christianai/shared/types/api/models";
import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "christianai-theme";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system"; // Default to system
}

function setStoredTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function useTheme(userPreferences?: UserPreferences | null) {
  // Priority: user preferences > localStorage > default (system)
  const getInitialTheme = useCallback((): Theme => {
    if (userPreferences?.theme) {
      return userPreferences.theme;
    }
    return getStoredTheme();
  }, [userPreferences?.theme]);

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    const initialTheme = getInitialTheme();
    return initialTheme === "system" ? getSystemTheme() : initialTheme;
  });

  // Update theme when user preferences change
  useEffect(() => {
    if (userPreferences?.theme) {
      const newTheme = userPreferences.theme;
      setThemeState(newTheme);
      setStoredTheme(newTheme); // Sync to localStorage

      const newResolvedTheme = newTheme === "system" ? getSystemTheme() : newTheme;
      setResolvedTheme(newResolvedTheme);
    }
  }, [userPreferences?.theme]);

  const applyTheme = useCallback((newResolvedTheme: "light" | "dark") => {
    setResolvedTheme(newResolvedTheme);

    // Apply/remove dark class
    const root = document.documentElement;
    if (newResolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const setThemeValue = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      setStoredTheme(newTheme);

      const newResolvedTheme = newTheme === "system" ? getSystemTheme() : newTheme;
      applyTheme(newResolvedTheme);
    },
    [applyTheme],
  );

  // Handle system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newResolvedTheme = getSystemTheme();
      applyTheme(newResolvedTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [applyTheme, resolvedTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeValue,
    isSystemTheme: theme === "system",
  };
}
