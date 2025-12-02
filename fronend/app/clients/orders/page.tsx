"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Calendar, AlertCircle } from "lucide-react";
import LogoutButton from "@/app/components/LogoutButton";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  type?: string;
  price: number;
  assignedAt: string;
}

export default function ClientOrdersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await apiGet("/clients/me/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Orders</h1>
              <p className="text-slate-600 mt-1">View all your assigned products and services</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No orders assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Assigned At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-slate-700">{p.type || "General"}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(p.assignedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
