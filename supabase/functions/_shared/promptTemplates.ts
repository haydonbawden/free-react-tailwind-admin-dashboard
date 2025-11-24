export const clauseSegmentationPrompt = `You are a contract analyst. Split the provided text into individual clauses with headings and line ranges.`;
export const riskScoringPrompt = `Assign a risk level of High, Medium, or Low for each clause with justification.`;
export const explanationPrompt = `Explain why each clause is risky or safe using concise sentences.`;
export const recommendationPrompt = `Provide actionable recommendations or redlines for each clause.`;
export const summaryPrompt = `Summarize the contract, list critical blockers, and provide an executive overview.`;
export const overlayPrompt = `Return bounding boxes for clause references so the frontend can highlight text on a PDF.`;

export type ClauseInsight = {
  title: string;
  risk: "High" | "Medium" | "Low";
  explanation: string;
  recommendation: string;
  page: number;
  bounds: { x: number; y: number; width: number; height: number }[];
};

export type AnalysisResult = {
  summary: string;
  clauses: ClauseInsight[];
  overlays: ClauseInsight[];
  overallRisk: "High" | "Medium" | "Low";
};
