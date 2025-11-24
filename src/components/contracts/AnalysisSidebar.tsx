import { Clause, ContractAnalysis } from "../../data/mockContracts";

interface Props {
  analysis: ContractAnalysis;
}

const riskColors: Record<Clause["risk"], string> = {
  High: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
  Medium: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
  Low: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
};

export default function AnalysisSidebar({ analysis }: Props) {
  return (
    <aside className="space-y-4">
      <div className="p-4 bg-white border rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">Overall risk</p>
        <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{analysis.overallRisk}</div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{analysis.summary}</p>
      </div>
      <div className="p-4 bg-white border rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Clause insights</h4>
        <div className="mt-3 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {analysis.clauses.map((clause) => (
            <div key={clause.id} className="p-3 border rounded-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{clause.title}</p>
                <span className={`px-2 py-1 text-[11px] rounded-full font-semibold ${riskColors[clause.risk]}`}>
                  {clause.risk}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{clause.explanation}</p>
              <p className="mt-2 text-xs font-medium text-gray-900 dark:text-white">Recommendation</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{clause.recommendation}</p>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Page {clause.page}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
