'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { useOperatorClientById } from '../../hooks/useOperator';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { client, loading, error } = useOperatorClientById(params.id);

  const renderClaimRows = (claim: any) => (
    <>
      <td className="px-6 py-4 font-medium text-white">{claim.title}</td>
      <td className="px-6 py-4">
        <StatusBadge status={claim.status} variant="claim" />
      </td>
      <td className="px-6 py-4 text-xs text-gray-400">
        {new Date(claim.createdAt).toLocaleDateString()}
      </td>
    </>
  );

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <PageHeader title="Client Not Found" />
        <div className="bg-red-900 text-red-300 p-4 rounded-lg">
          {error || 'Client not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-400 hover:text-blue-300"
      >
        ← Back
      </button>

      <PageHeader title={client.name} description={client.email} />

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Client Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white">{client.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white">{client.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <div className="mt-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                  {client.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Member Since</p>
              <p className="text-white">
                {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Associated Claims</h2>
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">
              {client.claims?.length || 0} claim(s) assigned to you
            </p>
          </div>
        </div>
      </div>

      {client.claims && client.claims.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Claims</h2>
          <DataTable
            headers={['Title', 'Status', 'Created']}
            data={client.claims}
            onRowClick={(claim) => router.push(`/operator/claims/${claim.id}`)}
            renderRow={renderClaimRows}
          />
        </div>
      )}
    </div>
  );
}
