"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, CheckCircle, Clock } from "lucide-react";

interface StatCard {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  trend: number;
}

export default function SupervisorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats([
        {
          title: "Assigned Operators",
          value: 5,
          icon: Users,
          color: "bg-gradient-to-br from-blue-500 to-cyan-600",
          trend: 0,
        },
        {
          title: "Active Leads",
          value: 23,
          icon: TrendingUp,
          color: "bg-gradient-to-br from-amber-500 to-orange-600",
          trend: 8,
        },
        {
          title: "Converted This Week",
          value: 4,
          icon: CheckCircle,
          color: "bg-gradient-to-br from-emerald-500 to-green-600",
          trend: 2,
        },
        {
          title: "Pending Tasks",
          value: 12,
          icon: Clock,
          color: "bg-gradient-to-br from-purple-500 to-pink-600",
          trend: -3,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Supervisor Dashboard</h1>
        <p className="text-slate-400 mt-1">Monitor your team's performance</p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-blue-500"></div>
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
            {/* Team Performance */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Team Performance</h2>
              <div className="space-y-4">
                {[
                  { name: "Mike Operator", leads: 8, converted: 2 },
                  { name: "John Operator", leads: 7, converted: 1 },
                  { name: "Sarah Operator", leads: 8, converted: 1 },
                ].map((operator, idx) => (
                  <div key={idx} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex justify-between mb-2">
                      <p className="text-white font-medium">{operator.name}</p>
                      <p className="text-slate-400 text-sm">
                        {operator.converted}/{operator.leads} converted
                      </p>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                        style={{
                          width: `${(operator.converted / operator.leads) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  {
                    action: "Lead converted by Mike",
                    time: "2 hours ago",
                    color: "text-emerald-400",
                  },
                  {
                    action: "John contacted new lead",
                    time: "4 hours ago",
                    color: "text-blue-400",
                  },
                  {
                    action: "Sarah marked task complete",
                    time: "6 hours ago",
                    color: "text-amber-400",
                  },
                ].map((activity, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.color}`}></div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-slate-400 text-xs">{activity.time}</p>
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
