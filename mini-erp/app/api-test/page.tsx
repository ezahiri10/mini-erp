"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

export default function ApiTestPage() {
  const [results, setResults] = useState<Array<{
    name: string;
    status: "pending" | "success" | "error";
    response: any;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api";

  async function testEndpoint(name: string, method: string, path: string, body?: any) {
    const newResult = {
      name,
      status: "pending" as const,
      response: null,
    };
    setResults((prev) => [...prev, newResult]);

    try {
      const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      setResults((prev) =>
        prev.map((r) =>
          r.name === name
            ? {
                ...r,
                status: res.ok ? "success" : "error",
                response: {
                  status: res.status,
                  statusText: res.statusText,
                  data,
                },
              }
            : r
        )
      );
    } catch (err: any) {
      setResults((prev) =>
        prev.map((r) =>
          r.name === name
            ? {
                ...r,
                status: "error",
                response: {
                  error: err.message,
                },
              }
            : r
        )
      );
    }
  }

  async function runAllTests() {
    setResults([]);
    setLoading(true);

    // Test 1: Register
    await testEndpoint("Register User", "POST", "/auth/register", {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
      role: "client",
    });

    // Test 2: Login
    await new Promise((resolve) => setTimeout(resolve, 500));
    await testEndpoint("Login User", "POST", "/auth/login", {
      email: "test@example.com",
      password: "password123",
    });

    // Test 3: Get Products
    const token = localStorage.getItem("token");
    if (token) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`${API_URL}/clients/me/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      setResults((prev) => [
        ...prev,
        {
          name: "Get Products",
          status: res.ok ? "success" : "error",
          response: {
            status: res.status,
            statusText: res.statusText,
            data,
          },
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">API Endpoint Tester</h1>
          <p className="text-slate-600 mb-6">Test your backend API endpoints</p>

          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-4">
              Backend URL: <code className="bg-slate-100 px-2 py-1 rounded">http://localhost:5000/api</code>
            </p>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Testing..." : "Run All Tests"}
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Results:</h2>
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-4 ${
                    result.status === "success"
                      ? "bg-green-50 border-green-200"
                      : result.status === "error"
                      ? "bg-red-50 border-red-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {result.status === "success" && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {result.status === "error" && (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    )}
                    {result.status === "pending" && (
                      <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                    )}
                    <h3 className="font-semibold text-lg text-slate-900">{result.name}</h3>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded font-mono text-sm overflow-x-auto">
                    <pre>{JSON.stringify(result.response, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Troubleshooting Guide</h2>
          <div className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold mb-2">❌ "API route not found"</h3>
              <p className="text-sm">
                Your backend doesn't have the endpoint implemented. Check that your backend has:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 ml-2">
                <li>POST /api/auth/register</li>
                <li>POST /api/auth/login</li>
                <li>GET /api/clients/me/products</li>
                <li>GET /api/clients/me/claims</li>
                <li>POST /api/clients/me/claims</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">✅ Curl Commands to Test</h3>
              <div className="bg-slate-900 text-slate-100 p-4 rounded font-mono text-xs overflow-x-auto space-y-4">
                <div>
                  <p className="text-blue-400">Register:</p>
                  <code>
                    curl -X POST http://localhost:5000/api/auth/register \<br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                    &nbsp;&nbsp;-d '{"{"}firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123","role":"client"{"}"}'
                  </code>
                </div>

                <div>
                  <p className="text-blue-400">Login:</p>
                  <code>
                    curl -X POST http://localhost:5000/api/auth/login \<br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                    &nbsp;&nbsp;-d '{"{"}email":"john@example.com","password":"password123"{"}"}'
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📋 Checklist</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Backend is running on http://localhost:5000</li>
                <li>Database is connected and running</li>
                <li>All required endpoints are implemented</li>
                <li>CORS is configured properly</li>
                <li>Request/response formats match the spec</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
