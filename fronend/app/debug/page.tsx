"use client";

import { useState } from "react";

export default function DebugPage() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("Operator");

  async function testLogin() {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const fullUrl = `${apiUrl}/auth/login`;

      console.log("Testing login at:", fullUrl);
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Role:", role);

      const res = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
        credentials: "include",
      });

      console.log("Status:", res.status);

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
        email,
        password,
        role,
        response: data,
      }, null, 2));
    } catch (err: any) {
      setResponse(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔍 Debug Login</h1>

      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Test Credentials</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="Supervisor">Supervisor</option>
              <option value="Operator">Operator</option>
              <option value="Client">Client</option>
            </select>
          </div>

          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Login"}
          </button>
        </div>
      </div>

      {response && (
        <div className="bg-white rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Response</h2>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded overflow-auto text-sm">
            {response}
          </pre>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 text-yellow-900">⚠️ What to do:</h2>
        <ol className="space-y-3 text-yellow-900 list-decimal list-inside">
          <li>
            <strong>Check your backend database</strong> - Does a user with email "demo@example.com" exist?
          </li>
          <li>
            <strong>Create a test user</strong> - You need to create a user first via your backend admin panel or database
          </li>
          <li>
            <strong>Use correct credentials</strong> - Replace email and password with real credentials
          </li>
          <li>
            <strong>Check backend logs</strong> - See what your backend is doing when login is called
          </li>
          <li>
            <strong>Verify password hashing</strong> - Make sure passwords are being hashed correctly
          </li>
        </ol>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 text-blue-900">📝 Backend Checklist:</h2>
        <ul className="space-y-2 text-blue-900 list-disc list-inside">
          <li>Backend is running on http://localhost:5000</li>
          <li>Database is connected</li>
          <li>User table has at least one test user</li>
          <li>POST /api/auth/login endpoint exists</li>
          <li>Passwords are hashed with bcrypt</li>
          <li>Email validation is correct</li>
          <li>Response format matches: <code className="bg-blue-100 px-2">{"{ token, authToken, user }"}</code></li>
        </ul>
      </div>
    </div>
  );
}
