"use client";

import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    ADMIN_OVERVIEW_STATS,
    BROADCAST_REACH_CHART,
} from "@/lib/adminMockData";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import RecentActivityFeed from "@/components/admin/RecentActivityFeed";
import QuickActionsBar from "@/components/admin/QuickActionsBar";
import PendingApprovalsWidget from "@/components/admin/PendingApprovalsWidget";

const stats = ADMIN_OVERVIEW_STATS;

export default function AdminOverviewPage() {
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    return (
        <>
            {/* Toast */}
            {toastMessage && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium">
                    {toastMessage}
                </div>
            )}

            {/* Page Header */}
            <div className="mb-6">
                <p
                    className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1"
                    style={{ color: "#64748b" }}
                >
                    Overview
                </p>
                <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                    Dashboard
                </h1>
            </div>

            {/* Stats Row 1 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <AdminStatsCard
                    label="Total Schemes Published"
                    value={stats.schemesPublished.toString()}
                    trend={`+${stats.schemesThisMonth} this month`}
                    trendDirection="up"
                    sparklineData={[
                        { v: 110 }, { v: 118 }, { v: 125 }, { v: 130 }, { v: 135 }, { v: 142 },
                    ]}
                />
                <AdminStatsCard
                    label="Active Broadcasts"
                    value={stats.activeBroadcasts.toString()}
                    trend={`${stats.scheduledBroadcasts} scheduled`}
                    trendDirection="neutral"
                />
                <AdminStatsCard
                    label="Upcoming Events"
                    value={stats.upcomingEvents.toString()}
                    trend="Next: Mar 3 · Health Camp"
                    trendDirection="neutral"
                />
            </div>

            {/* Stats Row 2 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <AdminStatsCard
                    label="Total Subscribers"
                    value={stats.totalSubscribers.toLocaleString("en-IN")}
                    trend={`+${stats.subscribersThisWeek.toLocaleString()} this week`}
                    trendDirection="up"
                    sparklineData={[
                        { v: 170000 }, { v: 174000 }, { v: 178000 }, { v: 180000 }, { v: 182000 }, { v: 184392 },
                    ]}
                />
                <AdminStatsCard
                    label="Delivery Rate"
                    value={`${stats.deliveryRate}%`}
                    trend="−0.2% from last week"
                    trendDirection="down"
                    sparklineData={[
                        { v: 97.1 }, { v: 96.8 }, { v: 96.9 }, { v: 96.5 }, { v: 96.4 },
                    ]}
                    accentColor="#ef4444"
                />
                <AdminStatsCard
                    label="Pending Approvals"
                    value={stats.pendingApprovals.toString()}
                    trend="3 schemes, 2 notices"
                    trendDirection="neutral"
                    accentColor="#f59e0b"
                />
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-5 gap-6 mb-6">
                {/* Left: Recent Activity (3 cols) */}
                <div className="col-span-3">
                    <RecentActivityFeed />
                </div>

                {/* Right: Broadcast Reach + Pending Approvals (2 cols) */}
                <div className="col-span-2">
                    {/* Broadcast Reach Widget */}
                    <div
                        className="bg-white rounded-xl border p-5"
                        style={{ borderColor: "#e2e8f0" }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h3
                                className="text-sm font-semibold"
                                style={{ color: "#1e293b" }}
                            >
                                Broadcast Reach
                            </h3>
                            <span
                                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: "rgba(59,130,246,0.08)",
                                    color: "#3b82f6",
                                }}
                            >
                                Last 7 Days
                            </span>
                        </div>

                        <div className="mb-3">
                            <p className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                                48,291{" "}
                                <span
                                    className="text-xs font-medium"
                                    style={{ color: "#22c55e" }}
                                >
                                    +8.4%
                                </span>
                            </p>
                            <p
                                className="text-[11px] uppercase tracking-wide"
                                style={{ color: "#64748b" }}
                            >
                                Messages Delivered
                            </p>
                        </div>

                        {/* Mini chart */}
                        <div className="h-[100px] mb-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={BROADCAST_REACH_CHART}>
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            fontSize: 11,
                                            borderRadius: 8,
                                            border: "1px solid #e2e8f0",
                                        }}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(val: any) => [
                                            Number(val).toLocaleString(),
                                            "Messages",
                                        ]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="messages"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: "#22c55e" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stats below chart */}
                        <div
                            className="flex items-center gap-4 pt-3 border-t"
                            style={{ borderColor: "#f1f5f9" }}
                        >
                            <div>
                                <p
                                    className="text-[11px] uppercase tracking-wide"
                                    style={{ color: "#64748b" }}
                                >
                                    Read Rate
                                </p>
                                <p
                                    className="text-sm font-bold"
                                    style={{ color: "#1e293b" }}
                                >
                                    {stats.readRate}%
                                </p>
                            </div>
                            <div
                                className="w-px h-8"
                                style={{ backgroundColor: "#e2e8f0" }}
                            />
                            <div>
                                <p
                                    className="text-[11px] uppercase tracking-wide"
                                    style={{ color: "#64748b" }}
                                >
                                    Replies
                                </p>
                                <p
                                    className="text-sm font-bold"
                                    style={{ color: "#1e293b" }}
                                >
                                    {stats.totalReplies.toLocaleString()}{" "}
                                    <span
                                        className="text-xs font-medium"
                                        style={{ color: "#22c55e" }}
                                    >
                                        +12%
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Approvals */}
                    <PendingApprovalsWidget count={stats.pendingApprovals} />
                </div>
            </div>

            {/* Bottom Row: Quick Actions */}
            <div className="mb-2">
                <h3
                    className="text-sm font-semibold mb-3"
                    style={{ color: "#1e293b" }}
                >
                    Quick Actions
                </h3>
                <QuickActionsBar
                    onAction={(label) =>
                        showToast(`${label} — feature opens in full page`)
                    }
                />
            </div>
        </>
    );
}
