import DocumentUploadCard from "../../components/contracts/DocumentUploadCard";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Upload() {
  const [lastUploadedPath, setLastUploadedPath] = useState<string | null>(null);
  const { session } = useAuth();

  return (
    <>
      <PageMeta title="Upload contract" description="Send PDF or DOCX to the AI pipeline" />
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="p-6 border rounded-2xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Upload contract</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Files are stored per-tenant in Supabase Storage. The <code>process_document</code> edge function extracts text,
            calls OpenAI, and writes back to the <code>analysis</code> table under Row Level Security.
          </p>
        </div>
        <DocumentUploadCard
          accessToken={session?.access_token}
          tenantId={session?.user.tenant_id}
          onUploadComplete={(path) => setLastUploadedPath(path)}
        />
        {lastUploadedPath && (
          <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
            Last upload saved to: {lastUploadedPath}
          </p>
        )}
      </div>
    </>
  );
}
