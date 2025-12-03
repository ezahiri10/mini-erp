"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Claim {
  id: string;
  title: string;
  description: string;
  status: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
  assignedUser?: { id: string; name: string; email: string };
  comments?: Comment[];
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: { id: string; name: string };
}

export default function ClientClaimDetailPage() {
  const router = useRouter();
  const params = useParams();
  const claimId = params.id as string;

  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [removingFile, setRemovingFile] = useState<string | null>(null);

  useEffect(() => {
    fetchClaim();
  }, [claimId]);

  const fetchClaim = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/client/claims/${claimId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch claim");

      const data = await response.json();
      setClaim(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommenting(true);
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/client/claims/${claimId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      setNewComment("");
      await fetchClaim(); // Refresh claim data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCommenting(false);
    }
  };

  const handleRemoveFile = async (filePath: string) => {
    if (!confirm("Are you sure you want to remove this file?")) return;

    setRemovingFile(filePath);
    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/client/claims/${claimId}/files`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) throw new Error("Failed to remove file");

      await fetchClaim(); // Refresh claim data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemovingFile(null);
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );

  if (!claim)
    return (
      <div className="py-8">
        <Link href="/client/claims" className="text-blue-400 hover:text-blue-300">
          ← Back to Claims
        </Link>
        <div className="mt-4 text-gray-400">Claim not found</div>
      </div>
    );

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/client/claims" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Claims
        </Link>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{claim.title}</h1>
            <p className="text-gray-400 mt-1">
              Created on {new Date(claim.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusTextColor(
              claim.status
            )} ${getStatusColor(claim.status)} bg-opacity-20`}
          >
            {claim.status}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{claim.description}</p>
          </div>

          {/* Files */}
          {claim.files && claim.files.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                Attached Files ({claim.files.length})
              </h2>
              <div className="space-y-2">
                {claim.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded hover:bg-gray-600 transition duration-200"
                  >
                    <a
                      href={`/${file}`}
                      download
                      className="flex items-center gap-3 flex-1 text-gray-300"
                    >
                      <svg
                        className="w-5 h-5"
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
                      <span>{file.split("/").pop()}</span>
                    </a>
                    <button
                      onClick={() => handleRemoveFile(file)}
                      disabled={removingFile === file}
                      className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-sm font-semibold transition duration-200"
                    >
                      {removingFile === file ? "Removing..." : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Comments {claim.comments && `(${claim.comments.length})`}
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Add a comment..."
                rows={3}
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-semibold transition duration-200"
              >
                {commenting ? "Posting..." : "Post Comment"}
              </button>
            </form>

            {/* Comments List */}
            {claim.comments && claim.comments.length > 0 ? (
              <div className="space-y-4">
                {claim.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-white">
                        {comment.author.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Claim Info */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Claim Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p
                  className={`font-semibold mt-1 ${getStatusTextColor(
                    claim.status
                  )}`}
                >
                  {claim.status}
                </p>
              </div>

              {claim.assignedUser && (
                <div>
                  <p className="text-gray-400 text-sm">Assigned To</p>
                  <p className="text-white font-semibold mt-1">
                    {claim.assignedUser.name}
                  </p>
                  <p className="text-gray-400 text-sm">{claim.assignedUser.email}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm">Created</p>
                <p className="text-white font-semibold mt-1">
                  {new Date(claim.createdAt).toLocaleDateString()} at{" "}
                  {new Date(claim.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Last Updated</p>
                <p className="text-white font-semibold mt-1">
                  {new Date(claim.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(claim.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <Link href="/client/claims">
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold transition duration-200">
                Back to Claims
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
