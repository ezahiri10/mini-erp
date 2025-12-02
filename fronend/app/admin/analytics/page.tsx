"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  revenueGrowth: number;
  totalLeads: number;
  leadsConversionRate: number;
  totalClaims: number;
  claimsResolutionRate: number;
  activeOperators: number;
  operatorProductivity: number;
}

interface ChartData {
  month: string;
  revenue: number;
  leads: number;
  claims: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      // Mock data - replace with actual API: GET /api/analytics
      const mockAnalytics: AnalyticsData = {
        totalRevenue: 450000,
        revenueGrowth: 12.5,
        totalLeads: 189,
        leadsConversionRate: 23.8,
        totalClaims: 47,
        claimsResolutionRate: 85.1,
        activeOperators: 8,
        operatorProductivity: 78.5,
      };

      const mockChartData: ChartData[] = [
        { month: "Jan", revenue: 35000, leads: 15, claims: 3 },
        { month: "Feb", revenue: 38000, leads: 18, claims: 4 },
        { month: "Mar", revenue: 42000, leads: 22, claims: 5 },
        { month: "Apr", revenue: 45000, leads: 25, claims: 6 },
        { month: "May", revenue: 50000, leads: 28, claims: 7 },
        { month: "Jun", revenue: 55000, leads: 32, claims: 8 },
        { month: "Jul", revenue: 52000, leads: 30, claims: 8 },
        { month: "Aug", revenue: 58000, leads: 35, claims: 9 },
        { month: "Sep", revenue: 62000, leads: 38, claims: 10 },
        { month: "Oct", revenue: 65000, leads: 40, claims: 11 },
        { month: "Nov", revenue: 68000, leads: 42, claims: 12 },
        { month: "Dec", revenue: 72000, leads: 45, claims: 13 },
      ];

      setAnalytics(mockAnalytics);
      setChartData(mockChartData);
    } catch (err: any) {
      console.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    change: number;
    icon: any;
    color: string;
  }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          <p className={`text-sm font-medium mt-2 ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {change >= 0 ? "+" : ""}{change}% from last period
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            Analytics & Reports
          </h1>
          <p className="text-slate-400 mt-1">System performance and insights</p>
        </div>
        <div className="flex gap-2">
          {["week", "month", "quarter", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`$${(analytics.totalRevenue / 1000).toFixed(0)}K`}
              change={analytics.revenueGrowth}
              icon={DollarSign}
              color="bg-gradient-to-br from-green-500 to-emerald-600"
            />
            <StatCard
              title="Lead Conversion"
              value={`${analytics.leadsConversionRate}%`}
              change={2.3}
              icon={TrendingUp}
              color="bg-gradient-to-br from-blue-500 to-cyan-600"
            />
            <StatCard
              title="Total Leads"
              value={analytics.totalLeads}
              change={5.2}
              icon={Users}
              color="bg-gradient-to-br from-amber-500 to-orange-600"
            />
            <StatCard
              title="Claim Resolution"
              value={`${analytics.claimsResolutionRate}%`}
              change={3.1}
              icon={BarChart3}
              color="bg-gradient-to-br from-purple-500 to-pink-600"
            />
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Revenue Trend</h2>
            <div className="space-y-4">
              {chartData.map((data) => {
                const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
                const percentage = (data.revenue / maxRevenue) * 100;
                return (
                  <div key={data.month}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-slate-300 font-medium">{data.month}</p>
                      <p className="text-white font-semibold">${(data.revenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leads by Status */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Leads by Status</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-slate-300">New</p>
                    <p className="text-white font-semibold">28%</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-slate-300">Contacted</p>
                    <p className="text-white font-semibold">42%</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-slate-300">Converted</p>
                    <p className="text-white font-semibold">24%</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "24%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-slate-300">Lost</p>
                    <p className="text-white font-semibold">6%</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: "6%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Claims by Status */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Claims by Status</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-slate-300">Submitted</p>
                    <p className="text-white font-semibold">17%</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "17%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-slate-300">In Review</p>
                    <p className="text-white font-semibold">26%</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "26%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-slate-300">Resolved</p>
                    <p className="text-white font-semibold">55%</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "55%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-slate-300">Rejected</p>
                    <p className="text-white font-semibold">2%</p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: "2%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operator Productivity */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Operator Productivity</h2>
            <div className="space-y-4">
              {[
                { name: "Mike Operator", productivity: 92, leads: 35 },
                { name: "Sarah Supervisor", productivity: 88, leads: 42 },
                { name: "John Operator", productivity: 85, leads: 28 },
                { name: "Emma Supervisor", productivity: 81, leads: 31 },
                { name: "David Operator", productivity: 78, leads: 26 },
              ].map((operator) => (
                <div key={operator.name} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div>
                    <p className="text-white font-medium">{operator.name}</p>
                    <p className="text-slate-400 text-sm">{operator.leads} leads assigned</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                        style={{ width: `${operator.productivity}%` }}
                      ></div>
                    </div>
                    <p className="text-white font-semibold w-12 text-right">{operator.productivity}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
