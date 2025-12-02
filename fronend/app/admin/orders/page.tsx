"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";

interface Order {
  id: string;
  clientName: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const data = await apiGet("/orders");
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(order: Order, status: Order["status"]) {
    try {
      setUpdatingOrder(order);
      await apiPatch(`/orders/${order.id}`, { status });
      fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update order.");
    } finally {
      setUpdatingOrder(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await apiDelete(`/orders/${id}`);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to delete order.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {loading ? (
        <div className="text-zinc-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full border border-zinc-300 rounded-md overflow-hidden">
          <thead className="bg-zinc-200">
            <tr>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-right">Quantity</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-zinc-200">
                <td className="px-4 py-2">{o.clientName}</td>
                <td className="px-4 py-2">{o.productName}</td>
                <td className="px-4 py-2 text-right">{o.quantity}</td>
                <td className="px-4 py-2 text-right">${o.totalPrice}</td>
                <td className="px-4 py-2">
                  <select
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o, e.target.value as Order["status"])
                    }
                    disabled={updatingOrder?.id === o.id}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-4 py-2 flex space-x-2 justify-center">
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-zinc-600">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
