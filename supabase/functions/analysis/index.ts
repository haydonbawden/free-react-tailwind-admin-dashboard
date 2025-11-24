// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

serve(async (req) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) return new Response("Missing document id", { status: 400 });

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });

  const tenantId = req.headers.get("x-tenant-id");
  if (!tenantId) return new Response("Missing tenant", { status: 400 });

  const { data, error } = await supabase
    .from("analysis")
    .select("clauses, overlays, summary, risk_rating")
    .eq("document_id", id)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (error) return new Response(error.message, { status: 500 });
  if (!data) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
