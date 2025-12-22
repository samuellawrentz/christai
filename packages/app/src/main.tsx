import { QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { queryClient } from "./lib/query-client";
import { LoginPage } from "./pages/auth/login";
import { ProtectedRoute } from "./pages/auth/protected-route";
import { SignupPage } from "./pages/auth/signup";
import { ChatsListPage } from "./pages/chats/index";
import { HomePage } from "./pages/home";
import { ProfilePage } from "./pages/profile";
import { useAuth, useInitAuth } from "./shared/hooks/use-auth";
import "./index.css";

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-F2FVEHRW7E", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

function App() {
  const { userAuthenticated } = useAuth();

  // Initialize auth state once
  useInitAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouteTracker />
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/"
            element={userAuthenticated ? <Navigate replace to="/home" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={userAuthenticated ? <Navigate replace to="/home" /> : <SignupPage />}
          />
          <Route
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
            path="/home"
          />
          <Route
            element={
              <ProtectedRoute>
                <ChatsListPage />
              </ProtectedRoute>
            }
            path="/chats"
          />
          <Route
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
            path="/profile"
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
