import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "../ui/button/Button";
import { supabaseClient } from "../../lib/supabaseClient";
import { mockDocuments } from "../../data/mockContracts";

interface Props {
  accessToken?: string;
  tenantId?: string;
  onUploadComplete?: (path: string) => void;
}

export default function DocumentUploadCard({ accessToken, tenantId, onUploadComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
    onDrop,
  });

  const helperText = useMemo(() => {
    if (!file) return "Drop PDF or DOCX contracts here";
    return `${file.name} (${Math.round(file.size / 1024)} KB)`;
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      if (!accessToken || !tenantId) {
        // Demo fallback
        onUploadComplete?.(`demo/${file.name}`);
        return;
      }
      const path = `${tenantId}/${crypto.randomUUID()}-${file.name}`;
      const { path: storagePath } = await supabaseClient.uploadDocument("contracts", path, file, accessToken);
      onUploadComplete?.(storagePath);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upload</p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contracts</h2>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Multi-tenant bucket: contracts</div>
      </div>
      <div
        {...getRootProps()}
        className={`mt-4 rounded-xl border-2 border-dashed p-6 text-center transition hover:border-brand-500 ${
          isDragActive ? "border-brand-500 bg-brand-50/40" : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-700 dark:text-gray-200">{helperText}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">We send to Supabase Storage, then trigger Edge Functions.</p>
      </div>
      <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Recent uploads: {mockDocuments.slice(0, 2).map((d) => d.name).join(", ")}
        </div>
        <Button size="sm" onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? "Uploading..." : "Upload & Analyze"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-error-500">{error}</p>}
    </div>
  );
}
