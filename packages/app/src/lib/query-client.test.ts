import { describe, expect, test } from "bun:test";
import { APIError, queryClient } from "./query-client";

describe("APIError", () => {
  test("creates error with message and status", () => {
    const error = new APIError("Not found", 404);

    expect(error.message).toBe("Not found");
    expect(error.status).toBe(404);
    expect(error.name).toBe("APIError");
  });

  test("creates error with message only", () => {
    const error = new APIError("Something went wrong");

    expect(error.message).toBe("Something went wrong");
    expect(error.status).toBeUndefined();
  });

  test("is instance of Error", () => {
    const error = new APIError("Test", 500);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof APIError).toBe(true);
  });
});

describe("queryClient default options", () => {
  test("has correct staleTime", () => {
    const options = queryClient.getDefaultOptions();
    expect(options.queries?.staleTime).toBe(5 * 60 * 1000);
  });

  test("retry returns false for 4xx errors", () => {
    const options = queryClient.getDefaultOptions();
    const retry = options.queries?.retry as (failureCount: number, error: Error) => boolean;

    expect(retry(1, new APIError("Bad request", 400))).toBe(false);
    expect(retry(1, new APIError("Unauthorized", 401))).toBe(false);
    expect(retry(1, new APIError("Forbidden", 403))).toBe(false);
    expect(retry(1, new APIError("Not found", 404))).toBe(false);
  });

  test("retry returns true for 5xx errors under limit", () => {
    const options = queryClient.getDefaultOptions();
    const retry = options.queries?.retry as (failureCount: number, error: Error) => boolean;

    expect(retry(1, new APIError("Server error", 500))).toBe(true);
    expect(retry(2, new APIError("Server error", 502))).toBe(true);
  });

  test("retry returns false after 3 failures", () => {
    const options = queryClient.getDefaultOptions();
    const retry = options.queries?.retry as (failureCount: number, error: Error) => boolean;

    expect(retry(3, new APIError("Server error", 500))).toBe(false);
    expect(retry(4, new Error("Network error"))).toBe(false);
  });

  test("mutations do not retry", () => {
    const options = queryClient.getDefaultOptions();
    expect(options.mutations?.retry).toBe(false);
  });
});
