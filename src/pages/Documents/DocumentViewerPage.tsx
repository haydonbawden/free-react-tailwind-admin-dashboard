import { useMemo } from "react";
import { useParams } from "react-router";
import AnalysisSidebar from "../../components/contracts/AnalysisSidebar";
import PdfViewer from "../../components/contracts/PdfViewer";
import PageMeta from "../../components/common/PageMeta";
import { mockAnalysis, mockDocuments } from "../../data/mockContracts";

export default function DocumentViewerPage() {
  const { id } = useParams();
  const document = useMemo(() => mockDocuments.find((d) => d.id === id), [id]);
  const analysis = useMemo(() => mockAnalysis, []);

  return (
    <>
      <PageMeta title="Document viewer" description="Render PDF with AI overlays" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-4">
          <div className="p-4 bg-white border rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Document</p>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{document?.name ?? "Unknown"}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Status: {document?.status ?? "–"}</p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Rendered with pdf.js from Storage</div>
            </div>
            <div className="mt-4">
              <PdfViewer fileUrl="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" overlays={analysis.clauses} />
            </div>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <AnalysisSidebar analysis={analysis} />
        </div>
      </div>
    </>
  );
}
