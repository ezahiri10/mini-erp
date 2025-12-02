"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet, apiLogout } from "@/lib/api";
import {
  LayoutDashboard,
  TrendingUp,
  CheckCircle,
  Clock,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPERVISOR" | "OPERATOR" | "CLIENT";
}

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        const data = await apiGet("/auth/me");
        console.log("[OperatorLayout] fetchMe response:", data);
        
        if (!data?.user?.role) {
          console.error("[OperatorLayout] No user or role in response");
          router.push("/login");
          return;
        }
        
        if (data.user.role !== "OPERATOR") {
          console.error("[OperatorLayout] User role is not OPERATOR:", data.user.role);
          router.push("/login");
          return;
        }
        
        setUser(data.user);
        console.log("[OperatorLayout] Operator verified:", data.user);
      } catch (err) {
        console.error("[OperatorLayout] Error fetching user:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  const navLinks = [
    { name: "Dashboard", href: "/operator/dashboard", icon: LayoutDashboard },
    { name: "My Leads", href: "/operator/leads", icon: TrendingUp },
    { name: "Tasks", href: "/operator/tasks", icon: Clock },
    { name: "Completed", href: "/operator/completed", icon: CheckCircle },
  ];

  async function handleLogout() {
    await apiLogout();
    router.push("/login");

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 md:relative md:translate-x-0 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Mini ERP
              </h1>
              <p className="text-xs text-slate-400">Operator</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-slate-700 rounded"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-700 space-y-3">
            {user && (
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-sm text-slate-400">Logged in as</p>
                <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors font-medium border border-red-700/30"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-slate-700 rounded-lg"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <h2 className="text-slate-300 font-medium hidden md:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
