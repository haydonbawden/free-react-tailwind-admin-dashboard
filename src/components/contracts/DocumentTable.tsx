import { mockDocuments, ContractDocument } from "../../data/mockContracts";
import { Link } from "react-router";

interface Props {
  documents?: ContractDocument[];
}

const statusColor: Record<ContractDocument["status"], string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function DocumentTable({ documents = mockDocuments }: Props) {
  return (
    <div className="p-6 bg-white border rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Documents</p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contract queue</h3>
        </div>
        <Link to="/documents/upload" className="text-sm text-brand-500 hover:text-brand-600">
          Upload new
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-500 uppercase border-b dark:text-gray-400 dark:border-gray-800">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Risk</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">{doc.name}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusColor[doc.status]}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-200">{doc.risk ?? "–"}</td>
                <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(doc.updatedAt).toLocaleString()}
                </td>
                <td className="px-3 py-3 text-sm">
                  <Link className="text-brand-500 hover:text-brand-600" to={`/documents/${doc.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
