"use client";

import { PENDING_APPROVALS } from "@/lib/adminMockData";
import { FileText, AlertTriangle } from "lucide-react";

interface PendingApprovalsWidgetProps {
    count: number;
}

export default function PendingApprovalsWidget({ count }: PendingApprovalsWidgetProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
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
                                <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            )}
                            <span className="text-sm text-slate-800 dark:text-slate-200">
                                {item.label}
                            </span>
                        </div>
                        <button className="text-xs font-medium text-green-500">
                            Review →
                        </button>
                    </div>
                ))}
            </div>

            <button className="w-full text-center text-xs font-medium mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 text-green-500">
                View All →
            </button>
        </div>
    );
}
