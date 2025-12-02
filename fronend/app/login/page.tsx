"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiLogin } from "@/lib/api";
import { LogIn, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Operator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!email.trim()) {
      const msg = "Email is required";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!password.trim()) {
      const msg = "Password is required";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!role) {
      const msg = "Role is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const result = await apiLogin(email.trim(), password.trim(), role);
      console.log("Login successful:", result);
      
      // Verify token was saved
      const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!savedToken) {
        console.error("Token not saved to localStorage!");
        setError("Login failed: Token not received");
        setLoading(false);
        return;
      }
      
      // Determine redirect path based on user's actual role from server
      let redirectPath = "/clients/dashboard"; // Default for Client
      
      if (result.user?.role === "ADMIN") {
        redirectPath = "/admin";
      } else if (result.user?.role === "SUPERVISOR") {
        redirectPath = "/supervisor/dashboard";
      } else if (result.user?.role === "OPERATOR") {
        redirectPath = "/operator/dashboard";
      }
      
      console.log("Redirecting to:", redirectPath);
      
      // Add small delay before redirect to ensure token is saved
      setTimeout(() => {
        router.push(redirectPath);
      }, 300);
    } catch (err: any) {
      const errorMsg = err.message || "Login failed. Please try again.";
      setError(errorMsg);
      console.error("Login error:", err);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
              <LogIn className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-slate-600 mb-6">
            Sign in to your Mini ERP account
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                autoComplete="current-password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                required
              >
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Operator">Operator</option>
                <option value="Client">Client</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password || !role}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-xs text-slate-600">
              Only authorized users can sign in. Contact your administrator for
              access.
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4 text-white text-sm text-center">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p className="text-opacity-75">Email: demo@example.com</p>
          <p className="text-opacity-75">Password: password123</p>
        </div>
      </div>
    </div>
  );
}
