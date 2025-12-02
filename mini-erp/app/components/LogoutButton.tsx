"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiLogout } from "@/lib/api";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      await apiLogout();
      // Redirect to login after logout
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Still redirect even if there's an error
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50"
    >
      <LogOut className="w-5 h-5" />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}
