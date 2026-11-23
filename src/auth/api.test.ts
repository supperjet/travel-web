import { describe, expect, it, vi } from "vitest";

import { getIdentity, signIn, signOut } from "./api";

describe("authentication API", () => {
  it("treats a 401 identity response as signed out", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ error: { code: "UNAUTHENTICATED", message: "Authentication required" } }, { status: 401 }));
    await expect(getIdentity()).resolves.toBeNull();
  });

  it("submits email login to Better Auth", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ user: {} }));
    await signIn("traveler@example.com", "password123");
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-in/email", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ email: "traveler@example.com", password: "password123", rememberMe: true }),
    }));
  });

  it("submits logout as JSON so Better Auth accepts the request", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ success: true }));

    await signOut();

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-out", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({}),
    }));
  });

});
