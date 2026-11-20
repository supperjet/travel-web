import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";

import { getIdentity, signIn, signOut, signUp } from "./api";
import type { AuthIdentity, RegistrationInput } from "./types";

interface AuthContextValue {
  identity: AuthIdentity | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<void>;
  register(input: RegistrationInput): Promise<void>;
  logout(): Promise<void>;
}

const identityKey = ["auth", "identity"] as const;
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const identityQuery = useQuery({ queryKey: identityKey, queryFn: getIdentity, retry: false, staleTime: 60_000 });

  const refreshIdentity = async () => {
    await queryClient.invalidateQueries({ queryKey: identityKey });
    await queryClient.fetchQuery({ queryKey: identityKey, queryFn: getIdentity, staleTime: 60_000 });
  };

  return (
    <AuthContext.Provider value={{
      identity: identityQuery.data ?? null,
      isLoading: identityQuery.isLoading,
      login: async (email, password) => { await signIn(email, password); await refreshIdentity(); },
      register: async (input) => { await signUp(input); await refreshIdentity(); },
      logout: async () => { await signOut(); queryClient.setQueryData(identityKey, null); },
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
