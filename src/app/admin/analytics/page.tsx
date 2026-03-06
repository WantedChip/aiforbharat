"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    ADMIN_OVERVIEW_STATS,
    BROADCAST_REACH_CHART,
} from "@/lib/adminMockData";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import TopSchemesTable from "@/components/admin/TopSchemesTable";
import StateBreakdownGrid from "@/components/admin/StateBreakdownGrid";

const stats = ADMIN_OVERVIEW_STATS;

const barData = BROADCAST_REACH_CHART.map((d) => ({
    day: d.day,
    Sent: d.messages,
    Delivered: Math.round(d.messages * 0.964),
    Read: Math.round(d.messages * 0.732),
}));

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("7D");

    return (
        <>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p
                        className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1"
                        style={{ color: "#64748b" }}
                    >
                        Insights
                    </p>
                    <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                        Analytics
                    </h1>
                </div>

                {/* Time range toggle */}
                <div
                    className="flex items-center rounded-lg overflow-hidden border"
                    style={{ borderColor: "#e2e8f0" }}
                >
                    {["7D", "30D", "90D"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeRange(t)}
                            className="px-4 py-2 text-sm font-medium transition-colors"
                            style={{
                                backgroundColor: timeRange === t ? "#1e293b" : "#ffffff",
                                color: timeRange === t ? "#ffffff" : "#64748b",
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <AdminStatsCard
                    label="Total Messages"
                    value="48,291"
                    trend="+8.2% vs last period"
                    trendDirection="up"
                />
                <AdminStatsCard
                    label="Avg. Delivery Rate"
                    value={`${stats.deliveryRate}%`}
                    trend="−0.2% vs last period"
                    trendDirection="down"
                />
                <AdminStatsCard
                    label="Avg. Read Rate"
                    value={`${stats.readRate}%`}
                    trend="+3.1% vs last period"
                    trendDirection="up"
                />
                <AdminStatsCard
                    label="New Subscribers"
                    value={stats.subscribersThisWeek.toLocaleString()}
                    trend="+12.4% vs last period"
                    trendDirection="up"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Weekly Message Volume */}
                <div
                    className="bg-white rounded-xl border p-5"
                    style={{ borderColor: "#e2e8f0" }}
                >
                    <h3
                        className="text-sm font-semibold mb-4"
                        style={{ color: "#1e293b" }}
                    >
                        Weekly Message Volume
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) =>
                                        v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                                    }
                                />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: 11,
                                        borderRadius: 8,
                                        border: "1px solid #e2e8f0",
                                    }}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(val: any) => Number(val).toLocaleString()}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: 11 }}
                                />
                                <Bar
                                    dataKey="Sent"
                                    fill="#cbd5e1"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="Delivered"
                                    fill="#1e293b"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="Read"
                                    fill="#22c55e"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Schemes */}
                <TopSchemesTable />
            </div>

            {/* State Breakdown */}
            <StateBreakdownGrid />
        </>
    );
}
