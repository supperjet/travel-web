import { ApiError, apiRequest } from "../api/client";
import type { AuthIdentity, RegistrationInput } from "./types";

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
