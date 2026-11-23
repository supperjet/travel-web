import { describe, expect, it, vi } from "vitest";

import { beginGoogleSignIn, getAuthProviders, getIdentity, signIn, signOut } from "./api";

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

  it("loads configured sign-in providers", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ google: true }));

    await expect(getAuthProviders()).resolves.toEqual({ google: true });
  });

  it("starts Google sign-in with a controlled callback URL", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({
      redirect: false,
      url: "https://accounts.google.com/o/oauth2/v2/auth?state=test",
    }));

    await expect(beginGoogleSignIn("http://localhost:3000/account")).resolves.toContain("accounts.google.com");
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-in/social", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        provider: "google",
        callbackURL: "http://localhost:3000/account",
        disableRedirect: true,
      }),
    }));
  });
});
