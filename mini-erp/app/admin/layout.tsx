"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";

interface User {
  id: string;
  name: string;
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
        if (!data || !["ADMIN", "SUPERVISOR", "OPERATOR"].includes(data.role)) {
          router.push("/login"); // redirect if not admin area role
          return;
        }
        setUser(data);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="animate-pulse text-zinc-600">Loading...</div>
      </div>
    );
  }

  const navLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Clients", href: "/admin/clients" },
    { name: "Leads", href: "/admin/leads" },
    { name: "Claims", href: "/admin/claims" },
    ...(user?.role === "ADMIN" ? [{ name: "Users", href: "/admin/users" }] : []),
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl">Mini ERP</div>
        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded hover:bg-zinc-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar (toggleable) */}
      <div className={`fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="w-64 bg-white h-full p-6">
          <button
            onClick={() => setSidebarOpen(false)}
            className="mb-4 px-2 py-1 bg-zinc-200 rounded"
          >
            Close
          </button>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className="block px-3 py-2 rounded hover:bg-zinc-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white shadow px-4 py-2">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden px-2 py-1 bg-zinc-200 rounded"
              onClick={() => setSidebarOpen(true)}
            >
              Menu
            </button>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>{user?.name}</span>
            <button
              onClick={async () => {
                await apiGet("/auth/logout");
                router.push("/login");
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 bg-zinc-100 flex-1">{children}</main>
      </div>
    </div>
  );
}
