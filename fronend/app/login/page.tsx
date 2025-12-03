"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiLogin } from "@/lib/api";
import { LogIn, AlertCircle, Shield, User, Lock, Mail } from "lucide-react";
import { CustomSelect } from "@/app/components/CustomSelect";
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
      let redirectPath = "/admin"; // Default for Admin
      
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

  const roleOptions = [
    { value: "Admin", label: "Administrator", icon: Shield },
    { value: "Supervisor", label: "Supervisor", icon: User },
    { value: "Operator", label: "Operator", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Main container with two sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center">
          {/* Left side - Branding (hidden on mobile) */}
          <div className="hidden lg:block px-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Mini ERP</h1>
              </div>
              
              <div className="space-y-4 pt-4">
                <h2 className="text-3xl font-bold text-white leading-tight">
                  Manage Your Business
                </h2>
                <p className="text-lg text-blue-100">
                  Streamline your operations with our comprehensive ERP system. Sign in to access your dashboard and manage claims, products, and team members.
                </p>
              </div>

              <div className="space-y-3 pt-8">
                {[
                  { icon: Shield, text: "Secure authentication" },
                  { icon: Lock, text: "Enterprise-grade security" },
                  { icon: User, text: "Role-based access control" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-blue-100">
                    <item.icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="lg:rounded-r-2xl bg-white lg:bg-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl">
            {/* Mobile header */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 lg:text-white">Mini ERP</h1>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 lg:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-slate-600 lg:text-blue-100 text-sm lg:text-base">
                  Sign in to your account to continue
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 lg:bg-red-900/20 border border-red-200 lg:border-red-500/30 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 lg:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 lg:text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-semibold text-slate-900 lg:text-white mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 lg:bg-slate-700 border border-slate-300 lg:border-slate-600 text-slate-900 lg:text-white placeholder-slate-500 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={loading}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Password field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-semibold text-slate-900 lg:text-white mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </div>
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 lg:bg-slate-700 border border-slate-300 lg:border-slate-600 text-slate-900 lg:text-white placeholder-slate-500 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={loading}
                    autoComplete="current-password"
                    required
                  />
                </div>

                {/* Role selection */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-xs sm:text-sm font-semibold text-slate-900 lg:text-white mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Select Your Role</span>
                    </div>
                  </label>
                  <CustomSelect
                    value={role}
                    onChange={(newRole) => {
                      setRole(newRole);
                      setError("");
                    }}
                    options={roleOptions}
                    disabled={loading}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password || !role}
                  className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm sm:text-base rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Signing in...</span>
                      <span className="sm:hidden">Signing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </div>
                  )}
                </button>
              </form>

              {/* Footer info */}
              <div className="pt-6 border-t border-slate-200 lg:border-slate-700">
                <p className="text-center text-xs text-slate-600 lg:text-slate-400">
                  Only authorized users can sign in. Contact your administrator for access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
