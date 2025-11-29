import DocumentUploadCard from "../../components/contracts/DocumentUploadCard";
import DocumentTable from "../../components/contracts/DocumentTable";
import PageMeta from "../../components/common/PageMeta";
import { mockAnalysis, mockDocuments } from "../../data/mockContracts";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";

const metrics = [
  { label: "Active tenants", value: "18", hint: "enforced via RLS" },
  { label: "Documents processed", value: "412", hint: "Edge Functions" },
  { label: "Average turnaround", value: "2m 10s", hint: "OpenAI pipeline" },
  { label: "High-risk findings", value: "67", hint: "Actionable" },
];

export default function Home() {
  const { session } = useSupabaseAuth();

  return (
    <>
      <PageMeta
        title="Contract Review Dashboard"
        description="Multi-tenant AI legal contract review built with Contract Reviewer"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-8">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 border rounded-2xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{metric.hint}</p>
              </div>
            ))}
          </section>

          <DocumentUploadCard
            accessToken={session?.access_token}
            tenantId={session?.user.tenant_id}
            onUploadComplete={(path) => console.log("Uploaded to", path)}
          />

          <DocumentTable documents={mockDocuments} />
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <div className="p-5 border rounded-2xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">AI summary</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{mockAnalysis.summary}</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
              {mockAnalysis.clauses.slice(0, 3).map((clause) => (
                <li key={clause.id} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-500" />
                  <div>
                    <p className="font-semibold">{clause.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Risk: {clause.risk}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 border rounded-2xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Workflow</p>
            <ol className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-200">
              <li>1. Upload to Supabase Storage bucket per tenant</li>
              <li>2. Edge function <code>process_document</code> extracts + sends to OpenAI</li>
              <li>3. RLS ensures tenant isolation for documents & analysis</li>
              <li>4. <code>generate_report</code> builds downloadable PDF in Storage</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
