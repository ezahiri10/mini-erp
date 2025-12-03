"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { 
  X, Plus, FileText, AlertCircle, CheckCircle, Clock, 
  Package, TrendingUp, Download, Share2, Eye, MoreVertical,
  Zap, Award, Shield, Calendar
} from "lucide-react";
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
  const router = useRouter();
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("clientToken");
      
      console.log("🔍 Checking authentication...");
      console.log("API URL:", apiUrl);
      console.log("Token exists:", !!token);
      
      if (!token) {
        console.log("❌ No token found, redirecting to login");
        toast.error("Not authenticated. Redirecting to login...");
        setTimeout(() => router.push("/client/login"), 1000);
        return;
      }

      console.log("✓ Token found, fetching data...");

      const [productsRes, claimsRes] = await Promise.all([
        fetch(`${apiUrl}/client/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/client/claims`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("Products response status:", productsRes.status);
      console.log("Claims response status:", claimsRes.status);

      const productsData = productsRes.ok ? await productsRes.json() : {};
      const claimsData = claimsRes.ok ? await claimsRes.json() : {};

      console.log("Products data:", productsData);
      console.log("Claims data:", claimsData);

      setProducts(Array.isArray(productsData.products) ? productsData.products : []);
      setClaims(Array.isArray(claimsData.claims) ? claimsData.claims : []);
    } catch (err: any) {
      console.error("❌ Error fetching data:", err);
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

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("clientToken");

      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      // Create claim first
      const claimRes = await fetch(`${apiUrl}/client/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: newClaimTitle.trim(),
          description: "",
        }),
      });

      if (!claimRes.ok) {
        throw new Error("Failed to create claim");
      }

      const claimData = await claimRes.json();
      const claimId = claimData.claim.id;

      // Upload file if provided
      if (newClaimFile) {
        const formData = new FormData();
        formData.append("files", newClaimFile);

        const uploadRes = await fetch(`${apiUrl}/client/claims/${claimId}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          console.warn("File upload warning");
        }
      }

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
      case "RESOLVED":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "IN_REVIEW":
        return <Clock className="w-5 h-5 text-amber-400" />;
      case "SUBMITTED":
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium";
    switch (status) {
      case "RESOLVED":
        return `${baseClasses} bg-emerald-900/30 text-emerald-400 border border-emerald-700/50`;
      case "IN_REVIEW":
        return `${baseClasses} bg-amber-900/30 text-amber-400 border border-amber-700/50`;
      case "SUBMITTED":
        return `${baseClasses} bg-blue-900/30 text-blue-400 border border-blue-700/50`;
      default:
        return baseClasses;
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header - Enhanced */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Client Portal</h1>
                  <p className="text-sm text-slate-400">Manage your products and claims</p>
                </div>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-blue-500"></div>
              </div>
              <p className="text-slate-400">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 opacity-80" />
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-80 mb-1">Total Products</p>
                <p className="text-4xl font-bold">{products.length}</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 opacity-80" />
                  <Zap className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-80 mb-1">Active Claims</p>
                <p className="text-4xl font-bold">{claims.filter(c => c.status !== "resolved").length}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 opacity-80" />
                  <Award className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm opacity-80 mb-1">Resolved Claims</p>
                <p className="text-4xl font-bold">{claims.filter(c => c.status === "resolved").length}</p>
              </div>
            </div>

            {/* Products Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Your Products & Services</h2>
              </div>

              {products.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
                  <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">No products assigned yet</p>
                  <p className="text-sm text-slate-500">Your assigned products will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="group bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                            <Package className="w-5 h-5 text-blue-400" />
                          </div>
                          <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                        <h3 className="font-bold text-white mb-2 text-lg">{p.name}</h3>
                        <div className="space-y-3 pt-3 border-t border-slate-600">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Price</span>
                            <span className="text-2xl font-bold text-blue-400">${p.price.toFixed(2)}</span>
                          </div>
                          <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Claims Section */}
            <section>
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Your Claims</h2>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-blue-500/50"
                >
                  <Plus className="w-5 h-5" />
                  <span>Submit Claim</span>
                </button>
              </div>

              {claims.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">No claims submitted yet</p>
                  <p className="text-sm text-slate-500 mb-6">Start by submitting your first claim</p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Submit First Claim
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {claims.map((c) => (
                    <div
                      key={c.id}
                      className="group bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-all hover:shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="p-2 bg-slate-700/50 rounded-lg">
                              <FileText className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-lg mb-1">{c.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Calendar className="w-4 h-4" />
                                {new Date(c.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div>
                            <div className={getStatusBadge(c.status)}>
                              {getStatusIcon(c.status)}
                              <span>{formatStatus(c.status)}</span>
                            </div>
                          </div>

                          {c.files && c.files.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {c.files.map((f, i) => (
                                <a
                                  key={i}
                                  href={f}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
                                  title={`Download file ${i + 1}`}
                                >
                                  <Download className="w-4 h-4" />
                                  File
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Submit New Claim</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="text-slate-400 hover:text-white transition-colors disabled:opacity-50 p-1 hover:bg-slate-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Claim Title *</label>
                <input
                  type="text"
                  value={newClaimTitle}
                  onChange={(e) => setNewClaimTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your claim"
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">Upload File *</label>
                <label className="block">
                  <input
                    type="file"
                    onChange={(e) => setNewClaimFile(e.target.files?.[0] || null)}
                    disabled={submitting}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer group">
                    <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3 group-hover:text-blue-400 transition-colors" />
                    <p className="text-white font-medium mb-1">
                      {newClaimFile ? newClaimFile.name : "Click or drag file to upload"}
                    </p>
                    <p className="text-sm text-slate-400">
                      {newClaimFile ? `${(newClaimFile.size / 1024 / 1024).toFixed(2)} MB` : "PDF, DOC, or IMAGE"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
              <button
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClaim}
                disabled={submitting || !newClaimTitle.trim() || !newClaimFile}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 shadow-lg"
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
