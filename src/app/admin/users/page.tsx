"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_USERS } from "@/lib/adminMockData";

export default function UsersPage() {
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
                        Management
                    </p>
                    <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                        Users
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: "#94a3b8" }}
                        />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 rounded-lg border text-sm w-[240px]"
                            style={{
                                borderColor: "#e2e8f0",
                                color: "#1e293b",
                                backgroundColor: "#ffffff",
                            }}
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="text-sm rounded-lg"
                        onClick={() => showToast("📥 Exporting to CSV via Amazon S3...")}
                    >
                        Export
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div
                className="bg-white rounded-xl border overflow-hidden"
                style={{ borderColor: "#e2e8f0" }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                {[
                                    "Name",
                                    "Phone",
                                    "State",
                                    "Registered",
                                    "Grievances Filed",
                                    "Status",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3"
                                        style={{ color: "#64748b" }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ADMIN_USERS.map((u) => (
                                <tr
                                    key={u.phone}
                                    className="hover:bg-gray-50/50 transition-colors"
                                    style={{ borderBottom: "1px solid #f1f5f9" }}
                                >
                                    <td
                                        className="px-5 py-4 text-sm font-medium"
                                        style={{ color: "#1e293b" }}
                                    >
                                        {u.name}
                                    </td>
                                    <td
                                        className="px-5 py-4 text-sm font-mono"
                                        style={{ color: "#64748b" }}
                                    >
                                        {u.phone}
                                    </td>
                                    <td
                                        className="px-5 py-4 text-sm"
                                        style={{ color: "#64748b" }}
                                    >
                                        {u.state}
                                    </td>
                                    <td
                                        className="px-5 py-4 text-sm"
                                        style={{ color: "#94a3b8" }}
                                    >
                                        {u.registered}
                                    </td>
                                    <td
                                        className="px-5 py-4 text-sm font-medium"
                                        style={{ color: "#1e293b" }}
                                    >
                                        {u.grievances}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                            style={{
                                                backgroundColor: "rgba(34,197,94,0.1)",
                                                color: "#22c55e",
                                            }}
                                        >
                                            {u.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
