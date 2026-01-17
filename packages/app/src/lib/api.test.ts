import { describe, expect, test } from "bun:test";
import { APIError } from "./query-client";

// API module requires Supabase env vars at import time
// These tests verify the APIError class behavior used throughout api.ts

describe("APIError for API responses", () => {
  test("401 Unauthorized error", () => {
    const error = new APIError("Session expired. Please sign in again.", 401);

    expect(error.status).toBe(401);
    expect(error.message).toContain("Session expired");
    expect(error.name).toBe("APIError");
  });

  test("400 Bad Request error", () => {
    const error = new APIError("Invalid request body", 400);

    expect(error.status).toBe(400);
    expect(error.message).toBe("Invalid request body");
  });

  test("404 Not Found error", () => {
    const error = new APIError("Resource not found", 404);

    expect(error.status).toBe(404);
  });

  test("500 Internal Server Error", () => {
    const error = new APIError("Internal server error", 500);

    expect(error.status).toBe(500);
  });

  test("error without status code", () => {
    const error = new APIError("Network error");

    expect(error.status).toBeUndefined();
    expect(error.message).toBe("Network error");
  });

  test("error stack trace exists", () => {
    const error = new APIError("Test error", 500);

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("APIError");
  });
});

describe("APIError type checking", () => {
  test("can check error type with instanceof", () => {
    const apiError = new APIError("API failed", 500);
    const genericError = new Error("Generic error");

    expect(apiError instanceof APIError).toBe(true);
    expect(apiError instanceof Error).toBe(true);
    expect(genericError instanceof APIError).toBe(false);
  });

  test("can distinguish 4xx from 5xx errors", () => {
    const clientError = new APIError("Bad request", 400);
    const serverError = new APIError("Server error", 500);

    const isClientError = (e: APIError) => e.status && e.status >= 400 && e.status < 500;
    const isServerError = (e: APIError) => e.status && e.status >= 500;

    expect(isClientError(clientError)).toBe(true);
    expect(isClientError(serverError)).toBe(false);
    expect(isServerError(serverError)).toBe(true);
    expect(isServerError(clientError)).toBe(false);
  });
});
