"use client";

import { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface StatCard {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  trend: number;
}

export default function OperatorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats([
        {
          title: "My Leads",
          value: 12,
          icon: TrendingUp,
          color: "bg-gradient-to-br from-blue-500 to-cyan-600",
          trend: 3,
        },
        {
          title: "Converted",
          value: 4,
          icon: CheckCircle,
          color: "bg-gradient-to-br from-emerald-500 to-green-600",
          trend: 1,
        },
        {
          title: "In Progress",
          value: 6,
          icon: Clock,
          color: "bg-gradient-to-br from-amber-500 to-orange-600",
          trend: 0,
        },
        {
          title: "Pending Review",
          value: 2,
          icon: AlertCircle,
          color: "bg-gradient-to-br from-purple-500 to-pink-600",
          trend: -1,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Operator Dashboard</h1>
        <p className="text-slate-400 mt-1">Track your leads and progress</p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-cyan-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                      <p
                        className={`text-sm font-medium mt-2 ${
                          stat.trend >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {stat.trend >= 0 ? "+" : ""}{stat.trend} from last week
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Leads */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Active Leads</h2>
              <div className="space-y-3">
                {[
                  { name: "Acme Corp", status: "Contacted", days: 3 },
                  { name: "Tech Solutions", status: "New", days: 1 },
                  { name: "Global Inc", status: "Follow-up", days: 5 },
                ].map((lead, idx) => (
                  <div key={idx} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-slate-400 text-sm">{lead.days} days ago</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          lead.status === "New"
                            ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                            : lead.status === "Contacted"
                              ? "bg-amber-900/30 text-amber-400 border border-amber-700/50"
                              : "bg-purple-900/30 text-purple-400 border border-purple-700/50"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Today's Tasks</h2>
              <div className="space-y-3">
                {[
                  { task: "Follow up with Acme Corp", priority: "High" },
                  { task: "Review Tech Solutions proposal", priority: "Medium" },
                  { task: "Complete lead conversion form", priority: "High" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <input
                      type="checkbox"
                      className="w-5 h-5 mt-0.5 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.task}</p>
                      <p
                        className={`text-xs font-semibold mt-1 ${
                          item.priority === "High" ? "text-red-400" : "text-amber-400"
                        }`}
                      >
                        {item.priority} Priority
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
