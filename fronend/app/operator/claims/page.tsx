'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { useOperatorClaims } from '../hooks/useOperator';

export default function ClaimsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>();
  const { claims, loading, error, pagination } = useOperatorClaims(page, statusFilter);

  const handleRowClick = (claim: any) => {
    router.push(`/operator/claims/${claim.id}`);
  };

  const renderClaimRows = (claim: any) => (
    <>
      <td className="px-6 py-4 font-medium text-white">{claim.title}</td>
      <td className="px-6 py-4 text-gray-300">{claim.client?.name || '-'}</td>
      <td className="px-6 py-4">
        <StatusBadge status={claim.status} variant="claim" />
      </td>
      <td className="px-6 py-4 text-gray-400">{claim.comments?.length || 0}</td>
      <td className="px-6 py-4 text-xs text-gray-400">
        {new Date(claim.createdAt).toLocaleDateString()}
      </td>
    </>
  );

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <PageHeader title="Claims" description="Your assigned claims" />
        <div className="bg-red-900 text-red-300 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <PageHeader title="Claims" description="Your assigned claims" />

      <div className="mb-6 flex gap-2">
        <select
          value={statusFilter || ''}
          onChange={(e) => {
            setStatusFilter(e.target.value || undefined);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <DataTable
        headers={['Title', 'Client', 'Status', 'Comments', 'Created']}
        data={claims}
        isLoading={loading}
        onRowClick={handleRowClick}
        emptyMessage="No claims found"
        renderRow={renderClaimRows}
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
