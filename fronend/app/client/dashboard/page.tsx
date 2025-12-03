"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardStats {
  totalClaims: number;
  totalProducts: number;
  claimsByStatus: {
    SUBMITTED?: number;
    IN_REVIEW?: number;
    RESOLVED?: number;
  };
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      console.log("🔍 Fetching dashboard...");
      const token = localStorage.getItem("clientToken");
      console.log("✓ Token found:", !!token);
      
      if (!token) {
        console.log("❌ No token, redirecting to login");
        router.push("/client/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      console.log("API URL:", apiUrl);
      
      const response = await fetch(`${apiUrl}/client/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) throw new Error("Failed to fetch dashboard");

      const data = await response.json();
      console.log("✓ Dashboard data loaded:", data);
      setStats(data);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientUser");
    router.push("/client/login");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to your client portal</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Claims Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Claims</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats?.totalClaims || 0}
              </p>
            </div>
            <div className="bg-blue-600 bg-opacity-20 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Submitted Claims */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Submitted</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats?.claimsByStatus?.SUBMITTED || 0}
              </p>
            </div>
            <div className="bg-yellow-600 bg-opacity-20 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Resolved Claims */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Resolved</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats?.claimsByStatus?.RESOLVED || 0}
              </p>
            </div>
            <div className="bg-green-600 bg-opacity-20 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/client/claims">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 cursor-pointer transition duration-200">
            <h3 className="text-lg font-semibold text-white mb-2">
              View Claims
            </h3>
            <p className="text-gray-400 text-sm">
              View and manage all your submitted claims
            </p>
          </div>
        </Link>

        <Link href="/client/claims/new">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 cursor-pointer transition duration-200">
            <h3 className="text-lg font-semibold text-white mb-2">
              New Claim
            </h3>
            <p className="text-gray-400 text-sm">
              Submit a new claim for review
            </p>
          </div>
        </Link>

        <Link href="/client/products">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 cursor-pointer transition duration-200">
            <h3 className="text-lg font-semibold text-white mb-2">
              Products
            </h3>
            <p className="text-gray-400 text-sm">
              Browse available products and services
            </p>
          </div>
        </Link>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
          <p className="text-gray-400 text-sm">
            Contact support for assistance with your account
          </p>
        </div>
      </div>
    </div>
  );
}
