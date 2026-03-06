"use client";

import { PENDING_APPROVALS } from "@/lib/adminMockData";
import { FileText, AlertTriangle } from "lucide-react";

interface PendingApprovalsWidgetProps {
    count: number;
}

export default function PendingApprovalsWidget({ count }: PendingApprovalsWidgetProps) {
    return (
        <div
            className="bg-white rounded-xl border p-4 mt-4"
            style={{ borderColor: "#e2e8f0" }}
        >
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold" style={{ color: "#1e293b" }}>
                    Pending Approvals
                </h4>
                <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                >
                    {count}
                </span>
            </div>

            <div className="space-y-2">
                {PENDING_APPROVALS.map((item) => (
                    <div
                        key={item.type}
                        className="flex items-center justify-between py-1.5"
                    >
                        <div className="flex items-center gap-2">
                            {item.type === "scheme" ? (
                                <FileText className="w-3.5 h-3.5" style={{ color: "#64748b" }} />
                            ) : (
                                <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
                            )}
                            <span className="text-sm" style={{ color: "#1e293b" }}>
                                {item.label}
                            </span>
                        </div>
                        <button className="text-xs font-medium" style={{ color: "#22c55e" }}>
                            Review →
                        </button>
                    </div>
                ))}
            </div>

            <button
                className="w-full text-center text-xs font-medium mt-3 pt-2 border-t"
                style={{ color: "#22c55e", borderColor: "#f1f5f9" }}
            >
                View All →
            </button>
        </div>
    );
}
