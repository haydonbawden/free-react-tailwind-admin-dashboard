import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { AuthContext, AuthContextValue } from "../context/AuthContext";
import { TenantAwareSession } from "../lib/supabaseClient";

function renderWithAuth(value: AuthContextValue, initialEntries = ["/"]) {
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Private dashboard</div>} />
          </Route>
          <Route path="/signin" element={<div>Sign in page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

const baseAuthValue: Omit<AuthContextValue, "session" | "loading"> = {
  error: null,
  signIn: async () => ({
    access_token: "token",
    user: { id: "1" },
  } as TenantAwareSession),
  signUp: async () => ({
    access_token: "token",
    user: { id: "1" },
  } as TenantAwareSession),
  signOut: () => {},
};

describe("ProtectedRoute", () => {
  it("renders a loading state while verifying session", () => {
    renderWithAuth({ ...baseAuthValue, session: null, loading: true });

    expect(screen.getByRole("status")).toHaveTextContent("Checking your session");
  });

  it("redirects unauthenticated users to sign in", () => {
    renderWithAuth({ ...baseAuthValue, session: null, loading: false });

    expect(screen.getByText(/sign in page/i)).toBeInTheDocument();
  });

  it("renders protected content when session exists", () => {
    renderWithAuth({ ...baseAuthValue, session: { access_token: "abc", user: { id: "1" } }, loading: false });

    expect(screen.getByText(/private dashboard/i)).toBeInTheDocument();
  });
});
