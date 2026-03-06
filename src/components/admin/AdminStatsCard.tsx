"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface AdminStatsCardProps {
    label: string;
    value: string;
    trend?: string;
    trendDirection?: "up" | "down" | "neutral";
    sparklineData?: { v: number }[];
    accentColor?: string;
}

export default function AdminStatsCard({
    label,
    value,
    trend,
    trendDirection = "neutral",
    sparklineData,
    accentColor,
}: AdminStatsCardProps) {
    const trendColor =
        trendDirection === "up"
            ? "#22c55e"
            : trendDirection === "down"
                ? "#ef4444"
                : "#64748b";

    const trendArrow =
        trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "";

    return (
        <div
            className="bg-white rounded-xl border p-5 relative overflow-hidden"
            style={{ borderColor: "#e2e8f0" }}
        >
            {/* Sparkline in top-right corner */}
            {sparklineData && sparklineData.length > 0 && (
                <div className="absolute top-3 right-3 w-[60px] h-[30px] opacity-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line
                                type="monotone"
                                dataKey="v"
                                stroke={accentColor || "#22c55e"}
                                strokeWidth={1.5}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Label */}
            <p
                className="text-[11px] font-semibold tracking-[0.08em] uppercase mb-2"
                style={{ color: "#64748b" }}
            >
                {label}
            </p>

            {/* Value */}
            <p
                className="text-2xl font-bold mb-1"
                style={{ color: "#1e293b" }}
            >
                {value}
            </p>

            {/* Trend */}
            {trend && (
                <p className="text-xs font-medium" style={{ color: trendColor }}>
                    {trendArrow} {trend}
                </p>
            )}
        </div>
    );
}
