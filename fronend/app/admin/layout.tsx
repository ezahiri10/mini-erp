"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet, apiLogout } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Package,
  Users2,
  Network,
  BarChart3,
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        const data = await apiGet("/auth/me");
        console.log("[AdminLayout] fetchMe response:", data);
        
        // Check if response has user object with ADMIN role
        if (!data?.user?.role) {
          console.error("[AdminLayout] No user or role in response");
          router.push("/login");
          return;
        }
        
        if (data.user.role !== "ADMIN") {
          console.error("[AdminLayout] User role is not ADMIN:", data.user.role);
          router.push("/login");
          return;
        }
        
        setUser(data.user);
        console.log("[AdminLayout] Admin verified:", data.user);
      } catch (err) {
        console.error("[AdminLayout] Error fetching user:", err);
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
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Leads", href: "/admin/leads", icon: TrendingUp },
    { name: "Clients", href: "/admin/clients", icon: Users2 },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Structure", href: "/admin/structure", icon: Network },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

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
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Mini ERP
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
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
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          {user && (
            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
                <p className="text-sm text-slate-400">Logged in as</p>
                <p className="font-semibold text-slate-200 truncate">{user.name}</p>
              </div>
              <button
                onClick={async () => {
                  await apiLogout();
                  router.push("/login");
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <h2 className="text-lg font-semibold text-slate-200 hidden sm:block">Admin Panel</h2>
          </div>
          <div className="text-sm text-slate-400">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
