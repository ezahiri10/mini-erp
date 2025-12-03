'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import CommentList from '../../components/CommentList';
import CommentForm from '../../components/CommentForm';
import ClaimProgress from '../../components/ClaimProgress';
import {
  useOperatorClaimById,
  useUpdateClaimStatus,
  useAddClaimComment,
} from '../../hooks/useOperator';

export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { claim, loading, error, refetch } = useOperatorClaimById(params.id);
  const { updateStatus, loading: statusLoading } = useUpdateClaimStatus();
  const { addComment, loading: commentLoading } = useAddClaimComment();
  const [newStatus, setNewStatus] = useState<string>();
  const [showStatusForm, setShowStatusForm] = useState(false);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      await updateStatus(params.id, newStatus);
      setNewStatus(undefined);
      setShowStatusForm(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (text: string) => {
    try {
      await addComment(params.id, text);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <PageHeader title="Claim Not Found" />
        <div className="bg-red-900 text-red-300 p-4 rounded-lg">
          {error || 'Claim not found'}
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

      <PageHeader title={claim.title} description={claim.description} />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Claim Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Client</p>
                <p className="text-white">{claim.client?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{claim.client?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <div className="mt-2">
                  <StatusBadge status={claim.status} variant="claim" />
                </div>
              </div>
              {claim.description && (
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{claim.description}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm">Created</p>
                <p className="text-white">
                  {new Date(claim.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              {!showStatusForm ? (
                <button
                  onClick={() => setShowStatusForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Status
                </button>
              ) : (
                <div className="space-y-4">
                  <select
                    value={newStatus || ''}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
                  >
                    <option value="">Select Status</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateStatus}
                      disabled={statusLoading || !newStatus}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {statusLoading ? 'Updating...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => {
                        setShowStatusForm(false);
                        setNewStatus(undefined);
                      }}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Claim Progress</h2>
            <ClaimProgress status={claim.status} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Comments</h2>
            <CommentList comments={claim.comments || []} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Add Comment</h2>
            <CommentForm onSubmit={handleAddComment} isLoading={commentLoading} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-xs">Total Comments</p>
                <p className="text-2xl font-bold text-blue-400">
                  {claim.comments?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Files Attached</p>
                <p className="text-2xl font-bold text-green-400">
                  {claim.files?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
