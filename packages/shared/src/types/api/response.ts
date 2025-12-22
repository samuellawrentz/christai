export interface APIResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
  message: string;
  timestamp?: string;
}
