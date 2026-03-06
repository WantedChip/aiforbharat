"use client";

import { useState } from "react";
import GrievanceTable from "@/components/admin/GrievanceTable";
import SystemStatusBar from "@/components/admin/SystemStatusBar";
import { ADMIN_OVERVIEW_STATS } from "@/lib/adminMockData";

const stats = ADMIN_OVERVIEW_STATS;

export default function GrievancesPage() {
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
            <div className="mb-6">
                <p
                    className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1"
                    style={{ color: "#64748b" }}
                >
                    Management
                </p>
                <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                    Grievances
                </h1>
            </div>

            {/* Stats Mini Row */}
            <div className="flex items-center gap-6 mb-6">
                {[
                    { label: "Total", value: stats.totalGrievances },
                    { label: "Pending", value: stats.pending },
                    { label: "In Progress", value: stats.inProgress },
                    { label: "Resolved", value: stats.resolved },
                ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span
                            className="text-xs font-medium"
                            style={{ color: "#64748b" }}
                        >
                            {s.label}:
                        </span>
                        <span
                            className="text-sm font-bold"
                            style={{ color: "#1e293b" }}
                        >
                            {s.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* Grievance Table */}
            <GrievanceTable onToast={showToast} />

            {/* AWS System Status */}
            <div className="mt-6">
                <SystemStatusBar />
            </div>
        </>
    );
}
