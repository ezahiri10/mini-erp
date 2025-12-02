"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch, apiDelete, apiPost } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Claim {
  id: string;
  title: string;
  status: "submitted" | "in_review" | "resolved";
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  products: Product[];
  totalIncome: number;
  claims: Claim[];
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      const data = await apiGet("/clients");
      setClients(data);
    } catch (err: any) {
      setError(err.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  }

  function openModal(client: Client) {
    setSelectedClient(client);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      await apiDelete(`/clients/${id}`);
      fetchClients();
    } catch (err: any) {
      setError(err.message || "Failed to delete client.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
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
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-right">Income</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-zinc-200">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2 text-right">${c.totalIncome}</td>
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
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-600">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && selectedClient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">{selectedClient.name}</h2>

            <div className="mb-4">
              <p>
                <strong>Email:</strong> {selectedClient.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedClient.phone}
              </p>
              <p>
                <strong>Total Income:</strong> ${selectedClient.totalIncome}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Products/Services</h3>
              <ul className="list-disc list-inside">
                {selectedClient.products.map((p) => (
                  <li key={p.id}>
                    {p.name} - ${p.price}
                  </li>
                ))}
                {selectedClient.products.length === 0 && <li>No products assigned</li>}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Claims</h3>
              <ul className="list-disc list-inside">
                {selectedClient.claims.map((c) => (
                  <li key={c.id}>
                    {c.title} - {c.status}
                  </li>
                ))}
                {selectedClient.claims.length === 0 && <li>No claims submitted</li>}
              </ul>
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
