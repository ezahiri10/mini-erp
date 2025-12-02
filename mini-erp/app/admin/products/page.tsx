"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await apiGet("/products");
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setFormData({ name: "", type: "", price: "" });
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setFormData({
      name: product.name,
      type: product.type,
      price: product.price.toString(),
    });
    setEditingProduct(product);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!formData.name || !formData.type || !formData.price) {
        setError("All fields are required.");
        return;
      }

      if (editingProduct) {
        await apiPatch(`/products/${editingProduct.id}`, {
          name: formData.name,
          type: formData.type,
          price: Number(formData.price),
        });
      } else {
        await apiPost("/products", {
          name: formData.name,
          type: formData.type,
          price: Number(formData.price),
        });
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiDelete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to delete product.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800"
        >
          Add Product
        </button>
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
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-zinc-200">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.type}</td>
                <td className="px-4 py-2 text-right">${p.price}</td>
                <td className="px-4 py-2 flex space-x-2 justify-center">
                  <button
                    onClick={() => openEditModal(p)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-zinc-600">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 bg-zinc-300 rounded hover:bg-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-zinc-900 text-white rounded hover:bg-zinc-800"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
