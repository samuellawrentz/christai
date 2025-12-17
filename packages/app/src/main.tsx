import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ChatsPage } from "./components/chats-page";
import { AuthLayout } from "./layouts/auth-layout";
import { LoginPage } from "./pages/auth/login";
import { ProtectedRoute } from "./pages/auth/protected-route";
import { SignupPage } from "./pages/auth/signup";
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
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route element={userAuthenticated ? <Navigate replace to="/chats" /> : <AuthLayout />}>
          <Route element={<LoginPage />} path="/" />
          <Route element={<SignupPage />} path="/signup" />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          }
          path="/chats"
        />
      </Routes>
    </BrowserRouter>
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
