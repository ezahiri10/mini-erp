"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

interface Lead {
  id: string;
  name: string;
  email: string;
  status: "new" | "contacted" | "converted" | "lost";
  assignedTo?: string; // operator id
  comments: string[];
  createdAt: string;
}

interface Operator {
  id: string;
  name: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchLeads();
    fetchOperators();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const data = await apiGet("/leads");
      setLeads(data);
    } catch (err: any) {
      setError(err.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchOperators() {
    try {
      const data = await apiGet("/users?role=OPERATOR");
      setOperators(data);
    } catch (err) {
      console.error(err);
    }
  }

  function openModal(lead: Lead) {
    setSelectedLead(lead);
    setComment("");
    setModalOpen(true);
  }

  async function handleStatusChange(status: Lead["status"]) {
    if (!selectedLead) return;
    await apiPatch(`/leads/${selectedLead.id}`, { status });
    setModalOpen(false);
    fetchLeads();
  }

  async function handleAssign(operatorId: string) {
    if (!selectedLead) return;
    await apiPatch(`/leads/${selectedLead.id}`, { assignedTo: operatorId });
    fetchLeads();
  }

  async function handleAddComment() {
    if (!selectedLead || !comment) return;
    await apiPost(`/leads/${selectedLead.id}/comments`, { text: comment });
    fetchLeads();
    setComment("");
  }

  async function handleConvert() {
    if (!selectedLead) return;
    await apiPatch(`/leads/${selectedLead.id}`, { status: "converted" });
    fetchLeads();
    setModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    await apiDelete(`/leads/${id}`);
    fetchLeads();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
      </div>

      {loading ? (
        <div className="text-zinc-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full border border-zinc-300 rounded-md overflow-hidden">
          <thead className="bg-zinc-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Assigned To</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-zinc-200">
                <td className="px-4 py-2">{l.name}</td>
                <td className="px-4 py-2">{l.email}</td>
                <td className="px-4 py-2">{l.status}</td>
                <td className="px-4 py-2">{operators.find(o => o.id === l.assignedTo)?.name || "Unassigned"}</td>
                <td className="px-4 py-2 flex space-x-2 justify-center">
                  <button
                    onClick={() => openModal(l)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-600">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">{selectedLead.name}</h2>
            <p className="mb-2"><strong>Email:</strong> {selectedLead.email}</p>
            <p className="mb-2"><strong>Status:</strong> {selectedLead.status}</p>
            <p className="mb-2"><strong>Assigned To:</strong> {operators.find(o => o.id === selectedLead.assignedTo)?.name || "Unassigned"}</p>

            <div className="mb-4">
              <label className="font-semibold">Change Status:</label>
              <select
                value={selectedLead.status}
                onChange={(e) => handleStatusChange(e.target.value as Lead["status"])}
                className="border px-2 py-1 rounded ml-2"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="font-semibold">Assign to Operator:</label>
              <select
                value={selectedLead.assignedTo || ""}
                onChange={(e) => handleAssign(e.target.value)}
                className="border px-2 py-1 rounded ml-2"
              >
                <option value="">Unassigned</option>
                {operators.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="font-semibold">Comments:</label>
              <ul className="list-disc list-inside mb-2">
                {selectedLead.comments.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
                {selectedLead.comments.length === 0 && <li>No comments</li>}
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

            <div className="flex justify-end space-x-2 mt-4">
              {selectedLead.status !== "converted" && (
                <button
                  onClick={handleConvert}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Convert to Client
                </button>
              )}
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
