export interface ApiErrorBody {
  error?: { code?: string; message?: string; requestId?: string };
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(path, { ...init, headers, credentials: "include" });
  const body = response.status === 204
    ? undefined
    : await response.json().catch(() => undefined) as ApiErrorBody | T | undefined;

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | undefined;
    throw new ApiError(
      response.status,
      errorBody?.error?.code ?? "REQUEST_FAILED",
      errorBody?.error?.message ?? errorBody?.message ?? "请求失败，请稍后重试",
      errorBody?.error?.requestId,
    );
  }

  return body as T;
}
