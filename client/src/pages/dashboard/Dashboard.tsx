import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  BarChart3,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "../../store/useAuthStore";
import StatCard from "../../components/dashboard/StatCard";
import api from "../../lib/axios";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 47000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 62000 },
  { month: "Jul", revenue: 58000 },
  { month: "Aug", revenue: 71000 },
  { month: "Sep", revenue: 67000 },
  { month: "Oct", revenue: 79000 },
  { month: "Nov", revenue: 74000 },
  { month: "Dec", revenue: 86000 },
];

const recentActivity = [
  {
    action: "Lease Signed",
    property: "The Azure Penthouse",
    amount: "+₹24,00,000",
    time: "Just now",
    type: "success",
  },
  {
    action: "Maintenance Request",
    property: "Villa Serena",
    amount: "-₹8,500",
    time: "2m ago",
    type: "warning",
  },
  {
    action: "Rent Received",
    property: "Emerald Gardens",
    amount: "+₹1,25,000",
    time: "15m ago",
    type: "success",
  },
  {
    action: "Property Listed",
    property: "Ivory Residences",
    amount: "₹6.1 Cr",
    time: "1h ago",
    type: "info",
  },
  {
    action: "Deposit Cleared",
    property: "Sapphire Tower",
    amount: "+₹50,000",
    time: "3h ago",
    type: "success",
  },
];

interface PropertyStats {
  totalProperties: number;
  totalValue: number;
  avgPrice: number;
  byStatus: { _id: string; count: number }[];
  byType: { _id: string; count: number }[];
}

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/properties/stats");
        setStats(data.data);
      } catch {
        // fine
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const occupiedCount =
    stats?.byStatus?.find((s) => s._id === "rented")?.count || 0;
  const totalProps = stats?.totalProperties || 0;
  const occupancyRate =
    totalProps > 0 ? Math.round((occupiedCount / totalProps) * 100) : 0;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* ── Welcome ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[11px] text-[var(--color-stone)] tracking-[0.12em] uppercase mb-1">
          {currentDate}
        </p>
        <h1
          className="text-[1.75rem] text-[var(--color-charcoal)] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome back,{" "}
          <span className="italic font-light text-[var(--color-stone)]">
            {user?.name?.split(" ")[0]}
          </span>
        </h1>
      </motion.div>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Properties"
          value={String(stats?.totalProperties || 0)}
          trend="+3 this month"
          trendUp
          icon={Building2}
          delay={0.04}
        />
        <StatCard
          label="Occupancy Rate"
          value={`${occupancyRate}%`}
          trend="+2.4%"
          trendUp
          icon={Users}
          delay={0.08}
        />
        <StatCard
          label="Portfolio Value"
          value={
            stats?.totalValue
              ? `₹${(stats.totalValue / 10000000).toFixed(1)} Cr`
              : "₹0"
          }
          trend="+8.2%"
          trendUp
          icon={DollarSign}
          delay={0.12}
        />
        <StatCard
          label="Avg. Yield"
          value="8.4%"
          trend="+0.6%"
          trendUp
          icon={TrendingUp}
          delay={0.16}
        />
      </div>

      {/* ── Chart + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart — 2/3 width */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-mist)] overflow-hidden"
        >
          {/* Chart header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-mist)]">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-charcoal)]">
                Revenue Overview
              </h3>
              <p className="text-[11px] text-[var(--color-stone)] mt-0.5">
                Monthly rental income for 2026
              </p>
            </div>
            <div className="flex gap-1">
              {["1M", "6M", "1Y", "All"].map((range) => (
                <button
                  key={range}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    range === "1Y"
                      ? "bg-[var(--color-charcoal)] text-white"
                      : "text-[var(--color-stone)] hover:bg-[var(--color-warm-white)]"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Chart — with consistent padding */}
          <div className="px-4 py-5">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={revenueData}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#EBEAE6"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#B4B0AB" }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#B4B0AB" }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1E1D1C",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                  }}
                  formatter={(value: any) => [
                    `₹${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelStyle={{
                    color: "#8E8A85",
                    marginBottom: 2,
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C9A96E"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity feed — 1/3 width */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-xl border border-[var(--color-mist)] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-mist)]">
            <h3 className="text-[14px] font-semibold text-[var(--color-charcoal)]">
              Activity
            </h3>
            <Activity className="w-4 h-4 text-[var(--color-champagne)]" />
          </div>

          <div className="flex-1 divide-y divide-[var(--color-mist)]/60 overflow-hidden">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--color-warm-white)]/50 transition-colors"
              >
                <div className="min-w-0 mr-3">
                  <p className="text-[13px] font-medium text-[var(--color-charcoal)] truncate leading-snug">
                    {item.action}
                  </p>
                  <p className="text-[11px] text-[var(--color-stone)] mt-0.5 leading-snug truncate">
                    {item.property}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-[12px] font-mono font-semibold leading-snug ${
                      item.type === "success"
                        ? "text-emerald-600"
                        : item.type === "warning"
                          ? "text-amber-600"
                          : "text-[var(--color-charcoal)]"
                    }`}
                  >
                    {item.amount}
                  </p>
                  <p className="text-[10px] text-[var(--color-stone-light)] uppercase tracking-wide mt-0.5 leading-snug">
                    {item.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="text-[13px] font-semibold text-[var(--color-charcoal)] uppercase tracking-[0.1em] mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Add Property",
              desc: "List a new property",
              icon: Plus,
              path: "/dashboard/properties/new",
            },
            {
              label: "View Properties",
              desc: "Manage your portfolio",
              icon: Building2,
              path: "/dashboard/properties",
            },
            {
              label: "Analytics",
              desc: "Performance insights",
              icon: BarChart3,
              path: "/dashboard/analytics",
            },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--color-mist)] hover:border-[var(--color-champagne)]/40 hover:shadow-sm transition-all duration-200 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--color-cream)] flex items-center justify-center group-hover:bg-[var(--color-champagne)]/10 transition-colors shrink-0">
                <action.icon className="w-4 h-4 text-[var(--color-champagne-dark)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--color-charcoal)] leading-snug">
                  {action.label}
                </p>
                <p className="text-[11px] text-[var(--color-stone)] leading-snug mt-0.5">
                  {action.desc}
                </p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-stone-light)] group-hover:text-[var(--color-champagne-dark)] transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
