"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Claim {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  assignedUser?: { name: string };
}

export default function ClientClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchClaims();
  }, [page, filter]);

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const statusParam = filter === "ALL" ? "" : `&status=${filter}`;
      const response = await fetch(
        `${apiUrl}/client/claims?page=${page}&limit=10${statusParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch claims");

      const data = await response.json();
      setClaims(data.claims);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-600";
      case "IN_REVIEW":
        return "bg-blue-600";
      case "RESOLVED":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "text-yellow-400";
      case "IN_REVIEW":
        return "text-blue-400";
      case "RESOLVED":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Claims</h1>
          <p className="text-gray-400 mt-1">Manage your submitted claims</p>
        </div>
        <Link href="/client/claims/new">
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition duration-200">
            + New Claim
          </button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-700">
        {["ALL", "SUBMITTED", "IN_REVIEW", "RESOLVED"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setPage(1);
            }}
            className={`px-4 py-2 font-semibold transition duration-200 ${
              filter === status
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Claims List */}
      {loading ? (
        <div className="text-center text-gray-400">Loading claims...</div>
      ) : claims.length === 0 ? (
        <div className="text-center bg-gray-800 rounded-lg p-12 border border-gray-700">
          <svg
            className="w-16 h-16 mx-auto text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No claims found
          </h3>
          <p className="text-gray-400 mb-4">
            You haven't submitted any claims yet
          </p>
          <Link href="/client/claims/new">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold">
              Create First Claim
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Link key={claim.id} href={`/client/claims/${claim.id}`}>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 cursor-pointer transition duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {claim.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${getStatusTextColor(
                      claim.status
                    )} ${getStatusColor(claim.status)} bg-opacity-20`}
                  >
                    {claim.status}
                  </span>
                </div>

                <p className="text-gray-400 mb-4 line-clamp-2">
                  {claim.description}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {claim.assignedUser && `Assigned to: ${claim.assignedUser.name}`}
                  </span>
                  <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
