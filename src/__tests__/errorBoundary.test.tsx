import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { reportClientError } from "../lib/telemetry";

vi.mock("../lib/telemetry", () => ({
  reportClientError: vi.fn(),
}));

function ProblemChild(): ReactElement {
  throw new Error("Boom");
}

describe("ErrorBoundary", () => {
  it("renders fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/we hit a snag/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /refresh page/i })).toBeInTheDocument();
    expect(reportClientError).toHaveBeenCalledWith(expect.any(Error), expect.any(String));
  });
});
