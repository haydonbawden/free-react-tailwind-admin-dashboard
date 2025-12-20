import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import DocumentUploadCard from "../components/contracts/DocumentUploadCard";
import { supabaseClient } from "../lib/supabaseClient";

vi.mock("../lib/supabaseClient", () => ({
  supabaseClient: {
    uploadDocument: vi.fn().mockResolvedValue({ path: "contracts/tenant-1/uuid-file.pdf" }),
  },
}));

describe("DocumentUploadCard", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("uploads with provided tenant and token", async () => {
    const onUploadComplete = vi.fn();
    render(<DocumentUploadCard accessToken="token" tenantId="tenant-1" onUploadComplete={onUploadComplete} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["content"], "contract.pdf", { type: "application/pdf" });
    await userEvent.upload(input, file);

    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalledWith("contracts/tenant-1/uuid-file.pdf");
    });

    expect(supabaseClient.uploadDocument).toHaveBeenCalledWith(
      "contracts",
      expect.stringContaining("tenant-1/"),
      file,
      "token",
    );
  });

  it("falls back to demo path when credentials are missing", async () => {
    const onUploadComplete = vi.fn();
    render(<DocumentUploadCard onUploadComplete={onUploadComplete} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["demo"], "draft.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    await userEvent.upload(input, file);

    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalledWith("demo/draft.docx");
    });
  });

  it("shows an error when upload fails", async () => {
    vi.mocked(supabaseClient.uploadDocument).mockRejectedValueOnce(new Error("Upload failed"));
    render(<DocumentUploadCard accessToken="token" tenantId="tenant-1" />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["content"], "contract.pdf", { type: "application/pdf" });
    await userEvent.upload(input, file);

    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Upload failed");
    });
  });
});
