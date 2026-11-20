import { describe, expect, it, vi } from "vitest";

import { ApiError, apiRequest } from "./client";

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
});
