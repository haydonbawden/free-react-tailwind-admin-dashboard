import PageMeta from "../../components/common/PageMeta";

export default function SettingsPage() {
  return (
    <>
      <PageMeta title="Tenant settings" description="Manage tenants and API keys" />
      <div className="max-w-5xl space-y-6">
        <div className="p-6 border rounded-2xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Tenant controls</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Multi-tenant isolation is enforced with Supabase Row Level Security. JWTs must contain <code>tenant_id</code> and
            every Edge Function validates it before reading or writing records.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200 list-disc list-inside">
            <li>Each table links to <code>tenant_id</code> with indexes for fast filtering.</li>
            <li>Policies allow access only when <code>tenant_id</code> matches <code>auth.jwt()</code>.</li>
            <li>Edge functions use the service role and still scope queries by tenant.</li>
          </ul>
        </div>
        <div className="p-6 border rounded-2xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API keys & environment</h2>
          <div className="grid gap-4 mt-3 md:grid-cols-2">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Supabase</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">VITE_SUPABASE_URL</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">VITE_SUPABASE_ANON_KEY</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">OpenAI</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">OPENAI_API_KEY</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Used inside Edge Functions</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
