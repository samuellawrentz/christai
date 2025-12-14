import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="font-bold text-4xl text-blue-600">ChristianAI</h1>
      </div>
    </React.StrictMode>
  );
}
