"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";

interface Claim {
  id: string;
  title: string;
  clientName: string;
  assignedTo?: string;
  status: "submitted" | "in_review" | "resolved";
  files: string[];
  comments: string[];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
}

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchClaims();
    fetchUsers();
  }, []);

  async function fetchClaims() {
    setLoading(true);
    try {
      const data = await apiGet("/claims");
      setClaims(data);
    } catch (err: any) {
      setError(err.message || "Failed to load claims.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    try {
      const data = await apiGet("/users"); // supervisors/operators
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  function openModal(claim: Claim) {
    setSelectedClaim(claim);
    setComment("");
    setModalOpen(true);
  }

  async function handleStatusChange(status: Claim["status"]) {
    if (!selectedClaim) return;
    await apiPatch(`/claims/${selectedClaim.id}`, { status });
    fetchClaims();
  }

  async function handleAssign(userId: string) {
    if (!selectedClaim) return;
    await apiPatch(`/claims/${selectedClaim.id}`, { assignedTo: userId });
    fetchClaims();
  }

  async function handleAddComment() {
    if (!selectedClaim || !comment) return;
    await apiPatch(`/claims/${selectedClaim.id}/comments`, { text: comment });
    fetchClaims();
    setComment("");
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this claim?")) return;
    await apiDelete(`/claims/${id}`);
    fetchClaims();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Claims</h1>
      </div>

      {loading ? (
        <div className="text-zinc-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full border border-zinc-300 rounded-md overflow-hidden">
          <thead className="bg-zinc-200">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Assigned To</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id} className="border-b border-zinc-200">
                <td className="px-4 py-2">{c.title}</td>
                <td className="px-4 py-2">{c.clientName}</td>
                <td className="px-4 py-2">{c.status}</td>
                <td className="px-4 py-2">{users.find(u => u.id === c.assignedTo)?.name || "Unassigned"}</td>
                <td className="px-4 py-2 flex space-x-2 justify-center">
                  <button
                    onClick={() => openModal(c)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-600">
                  No claims found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && selectedClaim && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">{selectedClaim.title}</h2>
            <p className="mb-2"><strong>Client:</strong> {selectedClaim.clientName}</p>
            <p className="mb-2"><strong>Status:</strong> {selectedClaim.status}</p>
            <p className="mb-2"><strong>Assigned To:</strong> {users.find(u => u.id === selectedClaim.assignedTo)?.name || "Unassigned"}</p>

            <div className="mb-4">
              <label className="font-semibold">Change Status:</label>
              <select
                value={selectedClaim.status}
                onChange={(e) => handleStatusChange(e.target.value as Claim["status"])}
                className="border px-2 py-1 rounded ml-2"
              >
                <option value="submitted">Submitted</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="font-semibold">Assign to User:</label>
              <select
                value={selectedClaim.assignedTo || ""}
                onChange={(e) => handleAssign(e.target.value)}
                className="border px-2 py-1 rounded ml-2"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Uploaded Files</h3>
              <ul className="list-disc list-inside">
                {selectedClaim.files.map((f, i) => (
                  <li key={i}>
                    <a href={f} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      File {i + 1}
                    </a>
                  </li>
                ))}
                {selectedClaim.files.length === 0 && <li>No files uploaded</li>}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Comments</h3>
              <ul className="list-disc list-inside mb-2">
                {selectedClaim.comments.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
                {selectedClaim.comments.length === 0 && <li>No comments</li>}
              </ul>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add comment"
                  className="border px-2 py-1 rounded flex-1"
                />
                <button
                  onClick={handleAddComment}
                  className="px-3 py-1 bg-zinc-900 text-white rounded hover:bg-zinc-800"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 bg-zinc-300 rounded hover:bg-zinc-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
