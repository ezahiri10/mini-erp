"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function RootRedirect() {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // No token - redirect to login
    if (!token || !user) {
      router.replace("/login");
      return;
    }

    // Token exists - redirect based on role
    switch (user.role) {
      case "ADMIN":
        router.replace("/admin/dashboard");
        break;
      case "SUPERVISOR":
        router.replace("/supervisor/dashboard");
        break;
      case "OPERATOR":
        router.replace("/operator/dashboard");
        break;
      case "CLIENT":
        router.replace("/client/dashboard");
        break;
      default:
        router.replace("/login");
    }
  }, [user, token, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-100 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
