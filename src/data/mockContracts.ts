export type Clause = {
  id: string;
  title: string;
  risk: "High" | "Medium" | "Low";
  explanation: string;
  recommendation: string;
  page: number;
  bounds: { x: number; y: number; width: number; height: number }[];
};

export type ContractAnalysis = {
  documentId: string;
  overallRisk: "High" | "Medium" | "Low";
  summary: string;
  clauses: Clause[];
  overlays: Clause[];
};

export type ContractDocument = {
  id: string;
  name: string;
  status: "pending" | "processing" | "complete" | "failed";
  updatedAt: string;
  risk?: "High" | "Medium" | "Low";
  storagePath?: string;
};

export const mockDocuments: ContractDocument[] = [
  {
    id: "doc-001",
    name: "MSA - Contoso (Redlines).pdf",
    status: "complete",
    risk: "Medium",
    updatedAt: "2025-01-21T10:00:00Z",
    storagePath: "contracts/doc-001.pdf",
  },
  {
    id: "doc-002",
    name: "DPA - Vendor X.pdf",
    status: "processing",
    updatedAt: "2025-01-22T09:00:00Z",
    storagePath: "contracts/doc-002.pdf",
  },
  {
    id: "doc-003",
    name: "NDA - Candidate.docx",
    status: "pending",
    updatedAt: "2025-01-23T08:30:00Z",
  },
];

export const mockAnalysis: ContractAnalysis = {
  documentId: "doc-001",
  overallRisk: "Medium",
  summary:
    "The agreement is commercially reasonable with several negotiable items in liability and data processing sections.",
  clauses: [
    {
      id: "c1",
      title: "Limitation of Liability",
      risk: "High",
      explanation: "Cap is 1x fees with exclusion for indirect damages missing.",
      recommendation: "Introduce mutual exclusion for consequential damages and increase cap to 2x fees.",
      page: 4,
      bounds: [{ x: 120, y: 320, width: 380, height: 70 }],
    },
    {
      id: "c2",
      title: "Data Processing",
      risk: "Medium",
      explanation: "DPA references obsolete sub-processor list.",
      recommendation: "Request updated list and 30-day notice with termination right.",
      page: 7,
      bounds: [{ x: 80, y: 500, width: 420, height: 60 }],
    },
    {
      id: "c3",
      title: "Governing Law",
      risk: "Low",
      explanation: "New York law with JAMS arbitration is acceptable.",
      recommendation: "No change required.",
      page: 10,
      bounds: [{ x: 100, y: 650, width: 360, height: 40 }],
    },
  ],
  overlays: [],
};
