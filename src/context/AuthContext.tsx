import { createContext, ReactNode, useContext, useMemo } from "react";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { TenantAwareSession } from "../lib/supabaseClient";

export type AuthContextValue = {
  session: TenantAwareSession | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<TenantAwareSession>;
  signUp: (
    email: string,
    password: string,
    tenantName: string,
  ) => Promise<TenantAwareSession>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useSupabaseAuth();

  const value = useMemo(() => auth, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
