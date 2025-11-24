// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { chromium } from "https://deno.land/x/chromium@0.3.1/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function renderReport(html: string) {
  const browser = await chromium.puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"], headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdf;
}

serve(async (req) => {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });

    const { tenant_id, document_id } = await req.json();
    if (!tenant_id || !document_id) return new Response("Missing identifiers", { status: 400 });

    const { data: analysis } = await supabase
      .from("analysis")
      .select("summary, clauses, risk_rating")
      .eq("tenant_id", tenant_id)
      .eq("document_id", document_id)
      .single();

    const html = `<!doctype html><html><head><meta charset="utf-8" /><style>body{font-family:Arial;padding:24px;}h1{margin-bottom:8px;}table{width:100%;border-collapse:collapse;}td,th{border:1px solid #ddd;padding:8px;}th{background:#f5f5f5;}</style></head><body><h1>Contract Review</h1><p>Overall risk: ${analysis?.risk_rating ?? "Unknown"}</p><p>${analysis?.summary ?? "Pending"}</p><h2>Clauses</h2><table><thead><tr><th>Clause</th><th>Risk</th><th>Recommendation</th></tr></thead><tbody>${(analysis?.clauses || [])
      .map(
        (clause: any) =>
          `<tr><td>${clause.title}</td><td>${clause.risk}</td><td>${clause.recommendation ?? ""}</td></tr>`
      )
      .join("")}</tbody></table></body></html>`;

    const pdf = await renderReport(html);
    const filename = `reports/${document_id}.pdf`;
    const { data, error } = await supabase.storage
      .from("reports")
      .upload(filename, pdf, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (error) throw error;

    const { data: signed } = await supabase.storage.from("reports").createSignedUrl(filename, 60 * 60);

    return new Response(JSON.stringify({ signed_url: signed?.signedUrl, path: data?.path }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
