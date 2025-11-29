export const prompts = {
  segmentation:
    "Segment the contract into clauses with headings, line numbers, and stable identifiers. Return JSON with an array of clauses.",
  risk:
    "For each clause return risk level (High/Medium/Low) with justification focused on commercial and data protection issues.",
  explanations: "Explain the risk in one or two sentences using plain language a lawyer would use in an email.",
  recommendations: "Provide a clear redline or negotiation ask for each risky clause.",
  summary: "Draft an executive summary with key blockers, negotiables, and acceptable items.",
  overlay:
    "Provide bounding boxes (x,y,width,height) per page so the frontend can highlight the PDF using pdf.js canvases.",
};
