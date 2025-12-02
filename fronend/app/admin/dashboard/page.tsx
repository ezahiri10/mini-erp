"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Users2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 12,
    totalLeads: 45,
    totalClients: 28,
    totalRevenue: 125000,
  });

  const [trends] = useState({
    usersChange: 2,
    leadsChange: -5,
    clientsChange: 3,
    revenueChange: 12,
  });

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      change: trends.usersChange,
      icon: Users,
      color: "from-blue-600 to-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      label: "Total Leads",
      value: stats.totalLeads,
      change: trends.leadsChange,
      icon: TrendingUp,
      color: "from-cyan-600 to-cyan-400",
      bgColor: "bg-cyan-900/20",
    },
    {
      label: "Total Clients",
      value: stats.totalClients,
      change: trends.clientsChange,
      icon: Users2,
      color: "from-emerald-600 to-emerald-400",
      bgColor: "bg-emerald-900/20",
    },
    {
      label: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}k`,
      change: trends.revenueChange,
      icon: DollarSign,
      color: "from-amber-600 to-amber-400",
      bgColor: "bg-amber-900/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome back! Here's your system overview.</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;
          return (
            <div
              key={card.label}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{card.label}</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{card.value}</h3>
                  <div className="flex items-center gap-1 mt-3">
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                    <span className={isPositive ? "text-emerald-400 text-sm" : "text-red-400 text-sm"}>
                      {isPositive ? "+" : ""}{card.change}% this month
                    </span>
                  </div>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Status */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Leads by Status</h3>
            <Link href="/admin/leads" className="text-blue-400 text-sm hover:text-blue-300">
              View all →
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { label: "New", value: 15, total: 45, color: "bg-blue-500" },
              { label: "In Progress", value: 20, total: 45, color: "bg-amber-500" },
              { label: "Converted", value: 10, total: 45, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                  <span className="text-slate-400 text-xs">{item.value} leads</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claims Status */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Claims by Status</h3>
            <Link href="/admin/dashboard" className="text-blue-400 text-sm hover:text-blue-300">
              View all →
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { label: "Submitted", value: 8, total: 32, color: "bg-blue-500", icon: AlertCircle },
              { label: "In Review", value: 12, total: 32, color: "bg-amber-500", icon: Clock },
              { label: "Resolved", value: 12, total: 32, color: "bg-emerald-500", icon: CheckCircle },
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ItemIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="text-slate-400 text-xs">{item.value} claims</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${(item.value / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add User", href: "/admin/users", icon: Users },
            { label: "New Lead", href: "/admin/leads", icon: TrendingUp },
            { label: "Add Client", href: "/admin/clients", icon: Users2 },
            { label: "New Product", href: "/admin/products", icon: Plus },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all group border border-slate-600"
              >
                <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-sm font-medium text-slate-300 text-center">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: "New lead created", user: "John Admin", time: "2 hours ago" },
            { action: "Client onboarded", user: "Sarah Supervisor", time: "4 hours ago" },
            { action: "Product assigned", user: "Mike Operator", time: "1 day ago" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
              <div>
                <p className="text-slate-300 text-sm font-medium">{activity.action}</p>
                <p className="text-slate-500 text-xs">{activity.user}</p>
              </div>
              <span className="text-slate-500 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
