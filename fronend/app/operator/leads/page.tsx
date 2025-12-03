'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { useOperatorLeads } from '../hooks/useOperator';

// Mock leads data for when API is not available
const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '555-0101',
    status: 'NEW' as const,
    notes: 'Interested in product demo',
    assignedTo: 'user-1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-0102',
    status: 'CONTACTED' as const,
    notes: 'Requested proposal',
    assignedTo: 'user-1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '555-0103',
    status: 'CONVERTED' as const,
    notes: 'Successfully closed deal',
    assignedTo: 'user-1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '555-0104',
    status: 'LOST' as const,
    notes: 'No response after follow-up',
    assignedTo: 'user-1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    comments: []
  }
];

export default function LeadsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>();
  const { leads: apiLeads, loading, error, pagination } = useOperatorLeads(page, statusFilter);

  // Use mock data if API fails or has no data
  const leads = error || apiLeads.length === 0 ? mockLeads : apiLeads;
  const displayPagination = error || apiLeads.length === 0 ? {
    total: mockLeads.length,
    page: 1,
    limit: 10,
    pages: 1
  } : pagination;

  const handleRowClick = (lead: any) => {
    router.push(`/operator/leads/${lead.id}`);
  };

  const renderLeadRows = (lead: any) => (
    <>
      <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
      <td className="px-6 py-4 text-gray-300">{lead.email}</td>
      <td className="px-6 py-4 text-gray-300">{lead.phone || '-'}</td>
      <td className="px-6 py-4">
        <StatusBadge status={lead.status} variant="lead" />
      </td>
      <td className="px-6 py-4 text-xs text-gray-400">
        {new Date(lead.createdAt).toLocaleDateString()}
      </td>
    </>
  );

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <PageHeader title="Leads" description="Your assigned leads" />

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
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CONVERTED">Converted</option>
          <option value="LOST">Lost</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 bg-blue-900/50 border border-blue-700 text-blue-300 p-4 rounded-lg">
          <p className="text-sm">Note: Using demo data. Backend server may not be running.</p>
        </div>
      )}

      <DataTable
        headers={['Name', 'Email', 'Phone', 'Status', 'Created']}
        data={leads}
        isLoading={loading}
        onRowClick={handleRowClick}
        emptyMessage="No leads found"
        renderRow={renderLeadRows}
      />

      {displayPagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-400">
            Page {page} of {displayPagination.pages}
          </span>
          <button
            onClick={() => setPage(Math.min(displayPagination.pages, page + 1))}
            disabled={page === displayPagination.pages}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
