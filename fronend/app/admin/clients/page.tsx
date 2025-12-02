"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, DollarSign, Activity, Search } from "lucide-react";
import { toast } from "react-toastify";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalIncome: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  productsCount: number;
  claimsCount: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      // Mock data - replace with actual API: GET /api/clients
      const mockClients: Client[] = [
        {
          id: "c1",
          name: "Acme Corp",
          email: "contact@acme.com",
          phone: "555-0123",
          totalIncome: 45000,
          status: "ACTIVE",
          createdAt: "2024-10-01",
          productsCount: 3,
          claimsCount: 2,
        },
        {
          id: "c2",
          name: "Tech Solutions Inc",
          email: "billing@techsol.com",
          phone: "555-0456",
          totalIncome: 82000,
          status: "ACTIVE",
          createdAt: "2024-09-15",
          productsCount: 5,
          claimsCount: 1,
        },
        {
          id: "c3",
          name: "Global Industries",
          email: "admin@globalind.com",
          phone: "555-0789",
          totalIncome: 0,
          status: "INACTIVE",
          createdAt: "2024-08-20",
          productsCount: 0,
          claimsCount: 0,
        },
      ];
      setClients(mockClients);
    } catch (err: any) {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE"
      ? "bg-emerald-900/30 text-emerald-400 border-emerald-700/50"
      : "bg-red-900/30 text-red-400 border-red-700/50";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-emerald-400" />
            Clients Management
          </h1>
          <p className="text-slate-400 mt-1">Manage clients and track income</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            setFormData({ name: "", email: "", phone: "" });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-emerald-500"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No clients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Client Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Total Income</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Products</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{client.name}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{client.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        ${client.totalIncome.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{client.productsCount} products</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingClient(client);
                            setFormData({
                              name: client.name,
                              email: client.email,
                              phone: client.phone,
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
                            setSelectedClient(client);
                            setActivityModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Activity"
                        >
                          <Activity className="w-4 h-4 text-cyan-400" />
                        </button>
                        <button
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

      {/* Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingClient ? "Edit Client" : "Create New Client"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Client Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
                  toast.success(editingClient ? "Client updated" : "Client created");
                  setModalOpen(false);
                  fetchClients();
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-lg transition-all font-medium"
              >
                {editingClient ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {activityModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Activity - {selectedClient.name}</h2>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex gap-3 pb-3 border-b border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium">Order #ORD-001 created</p>
                    <p className="text-slate-400 text-sm">2024-12-15 10:30 AM</p>
                  </div>
                </div>

                <div className="flex gap-3 pb-3 border-b border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium">Order #ORD-001 completed</p>
                    <p className="text-slate-400 text-sm">2024-12-10 02:15 PM</p>
                  </div>
                </div>

                <div className="flex gap-3 pb-3 border-b border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium">Client registered</p>
                    <p className="text-slate-400 text-sm">2024-10-01 08:45 AM</p>
                  </div>
                </div>
              </div>

              {selectedClient.claimsCount > 0 && (
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 mt-4">
                  <p className="text-white font-semibold mb-2">Claims: {selectedClient.claimsCount}</p>
                  <p className="text-slate-400 text-sm">View claim details for this client</p>
                </div>
              )}
            </div>

            <div className="flex justify-end p-6 border-t border-slate-700">
              <button
                onClick={() => setActivityModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors font-medium"
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
