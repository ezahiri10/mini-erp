"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewClientClaimPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("clientToken");
      if (!token) {
        router.push("/client/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Create claim first
      const claimResponse = await fetch(`${apiUrl}/client/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!claimResponse.ok) {
        const data = await claimResponse.json();
        throw new Error(data.error || "Failed to create claim");
      }

      const claimData = await claimResponse.json();
      const claimId = claimData.claim.id;

      // Upload files if any
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const uploadResponse = await fetch(
          `${apiUrl}/client/claims/${claimId}/upload`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          console.error("File upload warning: Some files may not have uploaded");
        }
      }

      setSuccess("Claim created successfully!");
      setTimeout(() => {
        router.push("/client/claims");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/client/claims" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Claims
        </Link>
        <h1 className="text-3xl font-bold text-white">Submit New Claim</h1>
        <p className="text-gray-400 mt-1">Fill out the form below to submit a new claim</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Claim Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Enter claim title"
            required
          />
          <p className="text-gray-400 text-xs mt-1">
            Provide a brief, descriptive title for your claim
          </p>
        </div>

        {/* Description Field */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Describe your claim in detail..."
            rows={5}
            required
          />
          <p className="text-gray-400 text-xs mt-1">
            Provide detailed information about your claim
          </p>
        </div>

        {/* File Upload Field */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Attach Supporting Documents (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition duration-200">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xlsx,.xls"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <svg
                className="w-12 h-12 mx-auto text-gray-500 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-300 font-semibold">Click to upload</p>
              <p className="text-gray-400 text-sm">or drag and drop</p>
              <p className="text-gray-500 text-xs mt-1">
                PDF, DOC, DOCX, JPG, PNG, GIF, XLS, XLSX (Max 10MB each)
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-300 mb-2">
                Selected Files ({files.length}):
              </p>
              <ul className="space-y-2">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-700 px-3 py-2 rounded text-sm text-gray-300 flex justify-between items-center"
                  >
                    <span>{file.name}</span>
                    <span className="text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !title || !description}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            {loading ? "Submitting..." : "Submit Claim"}
          </button>
          <Link href="/client/claims" className="flex-1">
            <button
              type="button"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded transition duration-200"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
