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

export const API_REQUEST_TIMEOUT_MS = 15_000;

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const controller = new AbortController();
  let didTimeout = false;
  const abortFromCaller = () => controller.abort(init.signal?.reason);
  if (init.signal?.aborted) abortFromCaller();
  else init.signal?.addEventListener("abort", abortFromCaller, { once: true });
  const timeout = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, API_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(path, {
      ...init,
      headers,
      credentials: "include",
      signal: controller.signal,
    });
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
  } catch (error) {
    if (didTimeout) {
      throw new ApiError(408, "REQUEST_TIMEOUT", "接口响应超时，请检查后端数据库连接后重试");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    init.signal?.removeEventListener("abort", abortFromCaller);
  }
}
