"use client";

import { useState } from "react";

export default function DebugLoginPage() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function testLogin() {
    setLoading(true);
    setResponse("Testing...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      console.log("API URL:", apiUrl);
      
      const fullUrl = `${apiUrl}/auth/login`;
      console.log("Full URL:", fullUrl);

      const res = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "demo@example.com",
          password: "password123",
        }),
        credentials: "include",
      });

      console.log("Status:", res.status, res.statusText);

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = await res.text();
      }

      console.log("Response:", data);

      setResponse(JSON.stringify({
        status: res.status,
        statusText: res.statusText,
        url: fullUrl,
        data: data,
      }, null, 2));
    } catch (err: any) {
      setResponse(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Login Endpoint</h1>

      <button
        onClick={testLogin}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        {loading ? "Testing..." : "Test Login"}
      </button>

      {response && (
        <div>
          <h2 className="text-lg font-bold mb-2">Response:</h2>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded overflow-auto">
            {response}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-4 rounded">
        <h2 className="font-bold mb-2">Checklist:</h2>
        <ul className="space-y-2">
          <li>
            ✅ Check <code className="bg-slate-100 px-2">.env.local</code> has: <code className="bg-slate-100 px-2">NEXT_PUBLIC_API_URL=http://localhost:5000/api</code>
          </li>
          <li>
            ✅ Backend is running on <code className="bg-slate-100 px-2">http://localhost:5000</code>
          </li>
          <li>
            ✅ Backend has <code className="bg-slate-100 px-2">POST /api/auth/login</code> endpoint
          </li>
          <li>
            ✅ Check browser console (F12) for detailed logs
          </li>
          <li>
            ✅ Check backend logs for requests
          </li>
        </ul>
      </div>
    </div>
  );
}
