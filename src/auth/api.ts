import { ApiError, apiRequest } from "../api/client";
import type { AuthIdentity, RegistrationInput } from "./types";

export interface AuthProviders {
  google: boolean;
}

interface SocialSignInResponse {
  redirect: boolean;
  url?: string;
}

export function getAuthProviders(): Promise<AuthProviders> {
  return apiRequest<AuthProviders>("/v1/auth/providers");
}

export async function getIdentity(): Promise<AuthIdentity | null> {
  try {
    return await apiRequest<AuthIdentity>("/v1/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  await apiRequest("/api/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password, rememberMe: true }),
  });
}

export async function signUp(input: RegistrationInput): Promise<void> {
  await apiRequest("/api/auth/sign-up/email", { method: "POST", body: JSON.stringify(input) });
}

export async function signOut(): Promise<void> {
  await apiRequest("/api/auth/sign-out", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function beginGoogleSignIn(callbackURL: string): Promise<string> {
  const result = await apiRequest<SocialSignInResponse>("/api/auth/sign-in/social", {
    method: "POST",
    body: JSON.stringify({
      provider: "google",
      callbackURL,
      disableRedirect: true,
    }),
  });

  if (!result.url) {
    throw new ApiError(502, "GOOGLE_SIGN_IN_UNAVAILABLE", "Google 登录暂时不可用，请稍后重试");
  }

  return result.url;
}
