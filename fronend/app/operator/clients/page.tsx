'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { useOperatorClients } from '../hooks/useOperator';

export default function ClientsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { clients, loading, error, pagination } = useOperatorClients(page);

  const handleRowClick = (client: any) => {
    router.push(`/operator/clients/${client.id}`);
  };

  const renderClientRows = (client: any) => (
    <>
      <td className="px-6 py-4 font-medium text-white">{client.name}</td>
      <td className="px-6 py-4 text-gray-300">{client.email}</td>
      <td className="px-6 py-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
          {client.status}
        </span>
      </td>
      <td className="px-6 py-4 text-xs text-gray-400">
        {new Date(client.createdAt).toLocaleDateString()}
      </td>
    </>
  );

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <PageHeader title="Clients" description="Your assigned clients" />
        <div className="bg-red-900 text-red-300 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <PageHeader title="Clients" description="Your assigned clients" />

      <DataTable
        headers={['Name', 'Email', 'Status', 'Created']}
        data={clients}
        isLoading={loading}
        onRowClick={handleRowClick}
        emptyMessage="No clients found"
        renderRow={renderClientRows}
      />

      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-400">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
