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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const inProgressOrders = orders.filter(o => o.status === "in_progress").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Orders
        </h1>
        <p className="text-gray-600 text-lg">Manage and track all customer orders</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search orders..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          + New Order
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-400">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-400">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-orange-600">{inProgressOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-400">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Quantity</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{o.clientName}</td>
                  <td className="px-6 py-4 text-gray-600">{o.productName}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{o.quantity}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${o.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(o, e.target.value as Order["status"])
                      }
                      disabled={updatingOrder?.id === o.id}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(o.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-600">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
