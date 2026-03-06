"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { BROADCASTS, ADMIN_OVERVIEW_STATS } from "@/lib/adminMockData";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import BroadcastRow from "@/components/admin/BroadcastRow";

const stats = ADMIN_OVERVIEW_STATS;

export default function BroadcastsPage() {
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    return (
        <>
            {toastMessage && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium">
                    {toastMessage}
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p
                        className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1"
                        style={{ color: "#64748b" }}
                    >
                        WhatsApp
                    </p>
                    <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                        Broadcasts
                    </h1>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: "#1e293b" }}
                    onClick={() => showToast("📡 New Broadcast composer — coming soon")}
                >
                    <Send className="w-4 h-4" />
                    New Broadcast
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <AdminStatsCard
                    label="Total Sent"
                    value="127"
                    trend="This month"
                    trendDirection="neutral"
                />
                <AdminStatsCard
                    label="Avg. Delivery Rate"
                    value={`${stats.deliveryRate}%`}
                    trend="Last 30 days"
                    trendDirection="neutral"
                />
                <AdminStatsCard
                    label="Total Reach"
                    value={stats.totalSubscribers.toLocaleString("en-IN")}
                    trend="Active subscribers"
                    trendDirection="neutral"
                />
            </div>

            {/* Recent Broadcasts */}
            <div
                className="bg-white rounded-xl border"
                style={{ borderColor: "#e2e8f0" }}
            >
                <div
                    className="px-5 py-4 border-b"
                    style={{ borderColor: "#e2e8f0" }}
                >
                    <h3
                        className="text-sm font-semibold"
                        style={{ color: "#1e293b" }}
                    >
                        Recent Broadcasts
                    </h3>
                </div>
                <div>
                    {BROADCASTS.map((b) => (
                        <BroadcastRow key={b.id} {...b} />
                    ))}
                </div>
            </div>

            {/* Bottom note */}
            <p className="text-xs mt-4 text-center" style={{ color: "#94a3b8" }}>
                Broadcasts sent via WhatsApp Business API · Powered by AWS Lambda
            </p>
        </>
    );
}
