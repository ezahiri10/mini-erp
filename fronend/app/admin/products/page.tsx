"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
import { apiPost, apiPut, apiDelete, apiGet } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  type: "SERVICE" | "PRODUCT";
  price: number;
  description: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForDelete, setSelectedProductForDelete] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "PRODUCT" as "SERVICE" | "PRODUCT",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await apiGet("/products");
      const mappedProducts = (Array.isArray(data) ? data : data.data || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        type: product.type || "PRODUCT",
        price: product.price,
        description: product.description || "",
        createdAt: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A",
      }));
      setProducts(mappedProducts);
    } catch (err: any) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || product.type === typeFilter;
    return matchesSearch && matchesType;
  });

  async function handleDeleteProduct() {
    if (!selectedProductForDelete) return;
    try {
      await apiDelete(`/products/${selectedProductForDelete.id}`);
      toast.success("Product deleted successfully");
      setDeleteConfirmationOpen(false);
      setSelectedProductForDelete(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Package className="w-8 h-8 text-amber-400" />
            Products & Services
          </h1>
          <p className="text-slate-400 mt-1">Manage products and services offered</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: "",
              type: "PRODUCT",
              price: "",
              description: "",
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value || null)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Types</option>
            <option value="PRODUCT">Product</option>
            <option value="SERVICE">Service</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-amber-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{product.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${
                        product.type === "SERVICE"
                          ? "bg-cyan-900/30 text-cyan-400 border-cyan-700/50"
                          : "bg-purple-900/30 text-purple-400 border-purple-700/50"
                      }`}>
                        {product.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{product.description}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">${product.price}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setFormData({
                              name: product.name,
                              type: product.type,
                              price: product.price.toString(),
                              description: product.description,
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
                            setSelectedProductForDelete(product);
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

      {/* Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="PRODUCT">Product</option>
                  <option value="SERVICE">Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                onClick={async () => {
                  if (!formData.name || !formData.price) {
                    toast.error("Name and price are required");
                    return;
                  }
                  try {
                    if (editingProduct) {
                      await apiPut(`/products/${editingProduct.id}`, {
                        name: formData.name,
                        type: formData.type,
                        price: Number(formData.price),
                        description: formData.description,
                      });
                      toast.success("Product updated successfully");
                    } else {
                      await apiPost("/products", {
                        name: formData.name,
                        type: formData.type,
                        price: Number(formData.price),
                        description: formData.description,
                      });
                      toast.success("Product created successfully");
                    }
                    setModalOpen(false);
                    fetchProducts();
                  } catch (err: any) {
                    toast.error(err.message || "Failed to save product");
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg transition-all font-medium"
              >
                {editingProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationOpen && selectedProductForDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Delete Product?</h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-semibold text-white">{selectedProductForDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                <p className="text-sm text-red-300">This will permanently remove the product from the system.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => {
                  setDeleteConfirmationOpen(false);
                  setSelectedProductForDelete(null);
                }}
                className="px-4 py-2 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
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
