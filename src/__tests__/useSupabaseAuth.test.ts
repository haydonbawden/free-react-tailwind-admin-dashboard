import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { supabaseClient, TenantAwareSession } from "../lib/supabaseClient";

vi.mock("../lib/supabaseClient", () => {
  const session: TenantAwareSession = {
    access_token: "token-123",
    user: { id: "user-1", email: "test@example.com", tenant_id: "tenant-1" },
  };

  return {
    supabaseClient: {
      signIn: vi.fn().mockResolvedValue(session),
      signUp: vi.fn().mockResolvedValue(session),
    },
  };
});

describe("useSupabaseAuth", () => {
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("persists session after sign in", async () => {
    const { result } = renderHook(() => useSupabaseAuth());

    await act(async () => {
      await result.current.signIn("user@example.com", "password");
    });

    expect(result.current.session?.access_token).toBe("token-123");
    expect(localStorage.getItem("saas-session")).toContain("token-123");
    expect(supabaseClient.signIn).toHaveBeenCalledWith("user@example.com", "password");
  });

  it("surfaces errors from failed sign in", async () => {
    vi.mocked(supabaseClient.signIn).mockRejectedValueOnce(new Error("Bad credentials"));
    const { result } = renderHook(() => useSupabaseAuth());

    await act(async () => {
      await expect(result.current.signIn("user@example.com", "wrong"))
        .rejects.toThrowError("Bad credentials");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Bad credentials");
      expect(result.current.loading).toBe(false);
    });
  });

  it("clears session on sign out", async () => {
    const { result } = renderHook(() => useSupabaseAuth());

    await act(async () => {
      await result.current.signUp("user@example.com", "password", "Tenant");
      result.current.signOut();
    });

    expect(result.current.session).toBeNull();
    expect(localStorage.getItem("saas-session")).toBeNull();
  });
});
