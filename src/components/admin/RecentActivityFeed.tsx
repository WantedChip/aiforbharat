"use client";

import { RECENT_ACTIVITY } from "@/lib/adminMockData";

const dotColors: Record<string, string> = {
    green: "#22c55e",
    blue: "#3b82f6",
    amber: "#f59e0b",
    red: "#ef4444",
};

const badgeStyles: Record<string, { bg: string; text: string }> = {
    green: { bg: "rgba(34,197,94,0.1)", text: "#22c55e" },
    blue: { bg: "rgba(59,130,246,0.1)", text: "#3b82f6" },
    amber: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b" },
    red: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
};

export default function RecentActivityFeed() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Recent Activity
                </h3>
                <button className="text-xs font-medium text-green-500">
                    View all →
                </button>
            </div>

            {/* Activity Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {RECENT_ACTIVITY.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        {/* Dot */}
                        <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: dotColors[item.dot] || "#94a3b8" }}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                {item.title}
                            </p>
                            <p className="text-xs truncate text-slate-500 dark:text-slate-400">
                                {item.subtitle}
                            </p>
                        </div>

                        {/* Time */}
                        <span className="text-[11px] shrink-0 text-slate-400 dark:text-slate-500">
                            {item.time}
                        </span>

                        {/* Status Badge */}
                        <span
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0"
                            style={{
                                backgroundColor: badgeStyles[item.statusColor]?.bg || "rgba(148,163,184,0.1)",
                                color: badgeStyles[item.statusColor]?.text || "#94a3b8",
                            }}
                        >
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
