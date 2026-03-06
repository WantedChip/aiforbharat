"use client";

import { useState } from "react";
import { MOCK_GRIEVANCES } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";

interface GrievanceTableProps {
    onToast: (msg: string) => void;
}

export default function GrievanceTable({ onToast }: GrievanceTableProps) {
    const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = MOCK_GRIEVANCES.filter((g) => {
        const matchesSearch =
            !search ||
            g.title.toLowerCase().includes(search.toLowerCase()) ||
            g.id.toLowerCase().includes(search.toLowerCase()) ||
            g.location.toLowerCase().includes(search.toLowerCase()) ||
            g.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "All" || g.status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleStatusUpdate = (id: string, newStatus: string) => {
        setStatusDropdown(null);
        onToast(`✅ ${id} updated to "${newStatus}" in DynamoDB`);
    };

    return (
        <div>
            {/* Controls */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "#94a3b8" }}
                    />
                    <input
                        type="text"
                        placeholder="Search grievances..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                        style={{
                            borderColor: "#e2e8f0",
                            color: "#1e293b",
                            backgroundColor: "#ffffff",
                        }}
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
                <Button
                    variant="outline"
                    className="text-sm rounded-lg"
                    onClick={() => onToast("📥 Exporting to CSV via Amazon S3...")}
                >
                    Export
                </Button>
            </div>

            {/* Table */}
            <div
                className="bg-white rounded-xl border overflow-hidden"
                style={{ borderColor: "#e2e8f0" }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                {["ID", "Category", "Title", "Location", "Date", "Status", "Action"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3"
                                            style={{ color: "#64748b" }}
                                        >
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((g) => (
                                <tr
                                    key={g.id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                    style={{ borderBottom: "1px solid #f1f5f9" }}
                                >
                                    <td
                                        className="px-5 py-4 text-sm font-mono"
                                        style={{ color: "#64748b" }}
                                    >
                                        {g.id}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className="text-xs font-medium px-2 py-1 rounded-md"
                                            style={{
                                                backgroundColor: "#f1f5f9",
                                                color: "#475569",
                                            }}
                                        >
                                            {g.category}
                                        </span>
                                    </td>
                                    <td
                                        className="px-5 py-4 text-sm font-medium"
                                        style={{ color: "#1e293b" }}
                                    >
                                        {g.title}
                                    </td>
                                    <td
                                        className="px-5 py-4 text-sm"
                                        style={{ color: "#64748b" }}
                                    >
                                        {g.location}
                                    </td>
                                    <td
                                        className="px-5 py-4 text-sm"
                                        style={{ color: "#94a3b8" }}
                                    >
                                        {g.date}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge status={g.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 relative">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs rounded-lg h-8"
                                            >
                                                View
                                            </Button>
                                            <div className="relative">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs rounded-lg h-8"
                                                    onClick={() =>
                                                        setStatusDropdown(
                                                            statusDropdown === g.id ? null : g.id
                                                        )
                                                    }
                                                >
                                                    Update Status{" "}
                                                    <ChevronDown className="w-3 h-3 ml-1" />
                                                </Button>
                                                {statusDropdown === g.id && (
                                                    <div
                                                        className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border py-1 min-w-[140px] z-50 animate-fade-in"
                                                        style={{ borderColor: "#e2e8f0" }}
                                                    >
                                                        {["Pending", "In Progress", "Resolved"].map(
                                                            (s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() =>
                                                                        handleStatusUpdate(g.id, s)
                                                                    }
                                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700 transition-colors"
                                                                >
                                                                    {s}
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-8 text-center text-sm"
                                        style={{ color: "#94a3b8" }}
                                    >
                                        No grievances match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
