import { useEffect, useState } from "react";
import { supabaseClient, TenantAwareSession } from "../lib/supabaseClient";

const LOCAL_KEY = "saas-session";

export function useSupabaseAuth() {
  const [session, setSession] = useState<TenantAwareSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      setSession(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const persist = (value: TenantAwareSession | null) => {
    setSession(value);
    if (value) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(LOCAL_KEY);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const next = await supabaseClient.signIn(email, password);
      persist(next);
      return next;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, tenantName: string) => {
    setLoading(true);
    setError(null);
    try {
      const next = await supabaseClient.signUp(email, password, tenantName);
      persist(next);
      return next;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign up";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => persist(null);

  return { session, loading, error, signIn, signUp, signOut };
}
