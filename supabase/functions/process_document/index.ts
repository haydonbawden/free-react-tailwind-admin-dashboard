// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.77.0";
import {
  AnalysisResult,
  clauseSegmentationPrompt,
  overlayPrompt,
  recommendationPrompt,
  riskScoringPrompt,
  summaryPrompt,
} from "../_shared/promptTemplates.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openAiKey = Deno.env.get("OPENAI_API_KEY")!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const openai = new OpenAI({ apiKey: openAiKey });

async function extractTextFromStorage(path: string) {
  const { data, error } = await supabase.storage.from("contracts").download(path);
  if (error) throw error;
  const buffer = await data.arrayBuffer();
  return new TextDecoder().decode(buffer);
}

async function runAnalysis(documentText: string): Promise<AnalysisResult> {
  const systemPrompt = [
    clauseSegmentationPrompt,
    riskScoringPrompt,
    recommendationPrompt,
    summaryPrompt,
    overlayPrompt,
  ].join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: documentText.slice(0, 12000) },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("OpenAI returned empty response");
  return JSON.parse(content) as AnalysisResult;
}

async function saveResult(documentId: string, tenantId: string, analysis: AnalysisResult) {
  const { error } = await supabase.from("analysis").insert({
    document_id: documentId,
    tenant_id: tenantId,
    summary: analysis.summary,
    clauses: analysis.clauses,
    overlays: analysis.overlays,
    risk_rating: analysis.overallRisk,
  });
  if (error) throw error;
}

serve(async (req) => {
  try {
    const signature = req.headers.get("authorization");
    if (!signature?.startsWith("Bearer ")) {
      return new Response("Missing auth", { status: 401 });
    }

    const { document_id, tenant_id, storage_path } = await req.json();
    if (!document_id || !tenant_id || !storage_path) {
      return new Response("Invalid payload", { status: 400 });
    }

    const text = await extractTextFromStorage(storage_path);
    const analysis = await runAnalysis(text);
    await saveResult(document_id, tenant_id, analysis);

    await supabase
      .from("documents")
      .update({ status: "complete", last_processed_at: new Date().toISOString() })
      .eq("id", document_id)
      .eq("tenant_id", tenant_id);

    return new Response(JSON.stringify({ status: "ok", analysis }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);
    await supabase
      .from("documents")
      .update({ status: "failed", last_processed_at: new Date().toISOString() })
      .eq("id", req.headers.get("x-document-id") || "");

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
