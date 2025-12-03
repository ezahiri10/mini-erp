import StatusBadge from "./StatusBadge";

interface DataTableProps {
  headers: string[];
  data: any[];
  onRowClick?: (row: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  renderRow?: (row: any, index: number) => React.ReactNode;
}

export default function DataTable({
  headers,
  data,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data found",
  renderRow,
}: DataTableProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <p className="text-gray-400 mt-4">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-700 border-b border-gray-600">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`hover:bg-gray-700 ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(row)}
            >
              {renderRow ? (
                renderRow(row, idx)
              ) : (
                <td colSpan={headers.length} className="px-6 py-4 text-gray-400">
                  No render function provided
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
