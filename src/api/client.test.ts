import { describe, expect, it, vi } from "vitest";

import { API_REQUEST_TIMEOUT_MS, ApiError, apiRequest } from "./client";

describe("API client", () => {
  it("always includes browser credentials", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ok: true }));
    await apiRequest("/v1/me");
    expect(fetchMock).toHaveBeenCalledWith("/v1/me", expect.objectContaining({ credentials: "include" }));
  });

  it("converts structured backend errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({
      error: { code: "UNAUTHENTICATED", message: "Authentication required", requestId: "request-1" },
    }, { status: 401 }));
    await expect(apiRequest("/v1/me")).rejects.toEqual(expect.objectContaining({
      status: 401, code: "UNAUTHENTICATED", message: "Authentication required", requestId: "request-1",
    }) as ApiError);
  });

  it("does not leave an unresponsive request pending forever", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation((_input, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));

    const request = apiRequest("/v1/hotels");
    const assertion = expect(request).rejects.toEqual(expect.objectContaining({
      status: 408,
      code: "REQUEST_TIMEOUT",
    }) as ApiError);

    await vi.advanceTimersByTimeAsync(API_REQUEST_TIMEOUT_MS);
    await assertion;
    vi.useRealTimers();
  });
});
