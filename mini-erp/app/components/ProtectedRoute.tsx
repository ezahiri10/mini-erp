"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const userRole = getUserRole();

    if (!token) {
      router.push("/login");
      return;
    }

    if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
      router.push("/unauthorized");
      return;
    }

    setIsAuthorized(true);
    setLoading(false);
  }, [requiredRoles, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}
