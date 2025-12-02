"use client";

import { useState, useEffect } from "react";
import { Network, Plus, Edit2, Trash2, Search, ToggleRight, ToggleLeft } from "lucide-react";
import { toast } from "react-toastify";

interface Binding {
  id: string;
  operatorId: string;
  operatorName: string;
  supervisorId: string;
  supervisorName: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
}

interface Operator {
  id: string;
  name: string;
  email: string;
}

interface Supervisor {
  id: string;
  name: string;
  email: string;
}

export default function StructurePage() {
  const [bindings, setBindings] = useState<Binding[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBinding, setEditingBinding] = useState<Binding | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedBindingForDelete, setSelectedBindingForDelete] = useState<Binding | null>(null);
  const [formData, setFormData] = useState({
    operatorId: "",
    supervisorId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      const mockOperators: Operator[] = [
        { id: "3", name: "Mike Operator", email: "mike@example.com" },
        { id: "4", name: "John Operator", email: "john@example.com" },
        { id: "5", name: "Sarah Operator", email: "sarah@example.com" },
      ];

      const mockSupervisors: Supervisor[] = [
        { id: "2", name: "Sarah Supervisor", email: "sarah@example.com" },
        { id: "6", name: "Emma Supervisor", email: "emma@example.com" },
      ];

      const mockBindings: Binding[] = [
        {
          id: "b1",
          operatorId: "3",
          operatorName: "Mike Operator",
          supervisorId: "2",
          supervisorName: "Sarah Supervisor",
          createdAt: "2024-11-01",
          status: "ACTIVE",
        },
        {
          id: "b2",
          operatorId: "4",
          operatorName: "John Operator",
          supervisorId: "2",
          supervisorName: "Sarah Supervisor",
          createdAt: "2024-10-20",
          status: "ACTIVE",
        },
        {
          id: "b3",
          operatorId: "5",
          operatorName: "Sarah Operator",
          supervisorId: "6",
          supervisorName: "Emma Supervisor",
          createdAt: "2024-10-10",
          status: "INACTIVE",
        },
      ];

      setOperators(mockOperators);
      setSupervisors(mockSupervisors);
      setBindings(mockBindings);
    } catch (err: any) {
      toast.error("Failed to load structure");
    } finally {
      setLoading(false);
    }
  }

  const filteredBindings = bindings.filter((binding) => {
    const matchesSearch =
      binding.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      binding.supervisorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || binding.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE"
      ? "bg-emerald-900/30 text-emerald-400 border-emerald-700/50"
      : "bg-red-900/30 text-red-400 border-red-700/50";
  };

  function handleToggleStatus(binding: Binding) {
    const updatedBindings = bindings.map((b) =>
      b.id === binding.id ? { ...b, status: (b.status === "ACTIVE" ? "INACTIVE" : "ACTIVE") as "ACTIVE" | "INACTIVE" } : b
    );
    setBindings(updatedBindings);
    toast.success(`Binding ${binding.status === "ACTIVE" ? "deactivated" : "activated"}`);
  }

  function handleDeleteBinding() {
    if (!selectedBindingForDelete) return;
    const updatedBindings = bindings.filter((b) => b.id !== selectedBindingForDelete.id);
    setBindings(updatedBindings);
    toast.success("Binding deleted successfully");
    setDeleteConfirmationOpen(false);
    setSelectedBindingForDelete(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Network className="w-8 h-8 text-purple-400" />
            Operator-Supervisor Structure
          </h1>
          <p className="text-slate-400 mt-1">Manage bindings and hierarchies</p>
        </div>
        <button
          onClick={() => {
            setEditingBinding(null);
            setFormData({ operatorId: "", supervisorId: "" });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Binding
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search bindings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Bindings Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-purple-500"></div>
          </div>
        ) : filteredBindings.length === 0 ? (
          <div className="p-12 text-center">
            <Network className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No bindings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Operator</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Supervisor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredBindings.map((binding) => (
                  <tr key={binding.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{binding.operatorName}</p>
                        <p className="text-slate-400 text-sm">Operator</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{binding.supervisorName}</p>
                        <p className="text-slate-400 text-sm">Supervisor</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(binding.status)}`}>
                        {binding.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{binding.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(binding)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title={binding.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        >
                          {binding.status === "ACTIVE" ? (
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-red-400" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingBinding(binding);
                            setFormData({
                              operatorId: binding.operatorId,
                              supervisorId: binding.supervisorId,
                            });
                            setModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBindingForDelete(binding);
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

      {/* Binding Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingBinding ? "Edit Binding" : "Create New Binding"}
              </h2>
              <p className="text-slate-400 text-sm mt-1">Assign operator to supervisor</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Operator</label>
                <select
                  value={formData.operatorId}
                  onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Operator</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name} ({op.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Supervisor</label>
                <select
                  value={formData.supervisorId}
                  onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Supervisor</option>
                  {supervisors.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name} ({sup.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-3 mt-4">
                <p className="text-slate-300 text-sm">
                  <span className="font-semibold">Info:</span> This binding will allow the selected operator to be supervised by the selected supervisor.
                </p>
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
                onClick={() => {
                  toast.success(editingBinding ? "Binding updated" : "Binding created");
                  setModalOpen(false);
                  fetchData();
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-medium"
              >
                {editingBinding ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationOpen && selectedBindingForDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Delete Binding?</h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-300">
                Are you sure you want to delete the binding between <span className="font-semibold text-white">{selectedBindingForDelete.operatorName}</span> and <span className="font-semibold text-white">{selectedBindingForDelete.supervisorName}</span>? This action cannot be undone.
              </p>
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                <p className="text-sm text-red-300">This will remove the supervisor-operator relationship.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => {
                  setDeleteConfirmationOpen(false);
                  setSelectedBindingForDelete(null);
                }}
                className="px-4 py-2 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBinding}
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
