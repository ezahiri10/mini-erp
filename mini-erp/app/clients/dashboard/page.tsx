"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { X, Plus, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import LogoutButton from "@/app/components/LogoutButton";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Claim {
  id: string;
  title: string;
  status: "submitted" | "in_review" | "resolved";
  files: string[];
  createdAt: string;
}

export default function ClientDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newClaimTitle, setNewClaimTitle] = useState("");
  const [newClaimFile, setNewClaimFile] = useState<File | null>(null);

  useEffect(() => {
    fetchClientData();
  }, []);

  async function fetchClientData() {
    try {
      setLoading(true);
      const [productsData, claimsData] = await Promise.all([
        apiGet("/clients/me/products"),
        apiGet("/clients/me/claims"),
      ]);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setClaims(Array.isArray(claimsData) ? claimsData : []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load dashboard data");
      setProducts([]);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateClaim() {
    if (!newClaimTitle.trim()) {
      toast.error("Claim title is required");
      return;
    }
    if (!newClaimFile) {
      toast.error("File is required");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", newClaimTitle.trim());
      formData.append("file", newClaimFile);

      await apiPost("/clients/me/claims", formData);
      setNewClaimTitle("");
      setNewClaimFile(null);
      setModalOpen(false);
      toast.success("Claim submitted successfully!");
      await fetchClientData();
    } catch (err: any) {
      console.error("Error creating claim:", err);
      toast.error(err.message || "Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_review":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "submitted":
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "resolved":
        return `${baseClasses} bg-green-100 text-green-700`;
      case "in_review":
        return `${baseClasses} bg-amber-100 text-amber-700`;
      case "submitted":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage your products and claims</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Products Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Products & Services</h2>
              {products.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                  <p className="text-slate-600">No products assigned yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-slate-900 mb-2">{p.name}</h3>
                      <p className="text-2xl font-bold text-blue-600">${p.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Claims Section */}
            <section>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Your Claims</h2>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Submit Claim</span>
                </button>
              </div>

              {claims.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No claims submitted yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Files</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {claims.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-900 font-medium">{c.title}</td>
                          <td className="px-6 py-4">
                            <div className={getStatusBadge(c.status)}>
                              {getStatusIcon(c.status)}
                              {c.status.replace("_", " ").charAt(0).toUpperCase() + c.status.slice(1).replace("_", " ")}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {c.files.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {c.files.map((f, i) => (
                                  <a
                                    key={i}
                                    href={f}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                                  >
                                    <FileText className="w-4 h-4" />
                                    File {i + 1}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">No files</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl animate-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Submit New Claim</h2>
              <button
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Claim Title</label>
                <input
                  type="text"
                  value={newClaimTitle}
                  onChange={(e) => setNewClaimTitle(e.target.value)}
                  placeholder="Enter claim title"
                  disabled={submitting}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setNewClaimFile(e.target.files?.[0] || null)}
                    disabled={submitting}
                    className="w-full h-full opacity-0 absolute cursor-pointer disabled:opacity-50"
                  />
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    {newClaimFile ? newClaimFile.name : "Click or drag file to upload"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClaim}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
