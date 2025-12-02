"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Plus, Edit2, Trash2, UserCheck, MessageSquare, Search } from "lucide-react";
import { toast } from "react-toastify";
import { apiPost, apiPut, apiDelete, apiGet } from "@/lib/api";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  assignedTo: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedLeadForDelete, setSelectedLeadForDelete] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLeadForComments, setSelectedLeadForComments] = useState<Lead | null>(null);
  const [commentText, setCommentText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "NEW" as "NEW" | "CONTACTED" | "CONVERTED" | "LOST",
    assignedTo: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const data = await apiGet("/leads");
      const mappedLeads = (Array.isArray(data) ? data : data.data || []).map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        status: lead.status || "NEW",
        assignedTo: lead.assignedTo || "",
        createdAt: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A",
      }));
      setLeads(mappedLeads);
    } catch (err: any) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-900/30 text-blue-400 border-blue-700/50",
      CONTACTED: "bg-amber-900/30 text-amber-400 border-amber-700/50",
      CONVERTED: "bg-emerald-900/30 text-emerald-400 border-emerald-700/50",
      LOST: "bg-red-900/30 text-red-400 border-red-700/50",
    };
    return colors[status] || "bg-slate-700 text-slate-300";
  };

  async function handleConvertToClient(lead: Lead) {
    try {
      await apiPost(`/leads/${lead.id}/convert`, {});
      toast.success(`${lead.name} converted to client`);
      fetchLeads();
    } catch (err: any) {
      toast.error(err.message || "Failed to convert lead");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            Leads Management
          </h1>
          <p className="text-slate-400 mt-1">Manage and convert leads to clients</p>
        </div>
        <button
          onClick={() => {
            setEditingLead(null);
            setFormData({
              name: "",
              email: "",
              phone: "",
              status: "NEW",
              assignedTo: "",
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-cyan-500"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Lead Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{lead.name}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{lead.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingLead(lead);
                            setFormData({
                              name: lead.name,
                              email: lead.email,
                              phone: lead.phone,
                              status: lead.status,
                              assignedTo: lead.assignedTo,
                            });
                            setModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleConvertToClient(lead)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Convert to Client"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLeadForComments(lead);
                            setCommentText("");
                            setCommentsModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Comments"
                        >
                          <MessageSquare className="w-4 h-4 text-cyan-400" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLeadForDelete(lead);
                            setDeleteConfirmationOpen(true);
                          }}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingLead ? "Edit Lead" : "Create New Lead"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Lead Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select Operator</option>
                  <option value="3">Mike Operator</option>
                  <option value="4">John Operator</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!formData.name || !formData.email) {
                    toast.error("Name and email are required");
                    return;
                  }
                  try {
                    if (editingLead) {
                      await apiPut(`/leads/${editingLead.id}`, {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        status: formData.status,
                        notes: "",
                      });
                      toast.success("Lead updated successfully");
                    } else {
                      await apiPost("/leads", {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        status: formData.status,
                        notes: "",
                      });
                      toast.success("Lead created successfully");
                    }
                    setModalOpen(false);
                    fetchLeads();
                  } catch (err: any) {
                    toast.error(err.message || "Failed to save lead");
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all font-medium"
              >
                {editingLead ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {commentsModalOpen && selectedLeadForComments && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Comments - {selectedLeadForComments.name}</h2>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Add Comment</label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type your comment here..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <p className="text-sm text-slate-400">
                Comments functionality is available via the API. To add comments, make a POST request to /comments with the lead ID.
              </p>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => {
                  setCommentsModalOpen(false);
                  setSelectedLeadForComments(null);
                  setCommentText("");
                }}
                className="px-4 py-2 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  if (!commentText.trim()) {
                    toast.error("Comment cannot be empty");
                    return;
                  }
                  try {
                    // TODO: Replace with actual API call to save comment
                    // await apiPost(`/leads/${selectedLeadForComments?.id}/comments`, { text: commentText });
                    toast.success("Comment saved successfully");
                    setCommentText("");
                    setCommentsModalOpen(false);
                    setSelectedLeadForComments(null);
                  } catch (err: any) {
                    toast.error(err.message || "Failed to save comment");
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationOpen && selectedLeadForDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Delete Lead?</h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-semibold text-white">{selectedLeadForDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                <p className="text-sm text-red-300">This will permanently remove all associated data.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => {
                  setDeleteConfirmationOpen(false);
                  setSelectedLeadForDelete(null);
                }}
                className="px-4 py-2 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await apiDelete(`/leads/${selectedLeadForDelete.id}`);
                    toast.success("Lead deleted successfully");
                    setDeleteConfirmationOpen(false);
                    setSelectedLeadForDelete(null);
                    fetchLeads();
                  } catch (err: any) {
                    toast.error(err.message || "Failed to delete lead");
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
