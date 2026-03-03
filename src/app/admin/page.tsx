"use client";

import { useState } from "react";
import {
    BarChart3,
    Users,
    Settings,
    FileText,
    LayoutDashboard,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_GRIEVANCES, ADMIN_STATS } from "@/lib/mockData";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import AnalyticsChart from "@/components/AnalyticsChart";

const sidebarLinks = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: FileText, label: "Grievances" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Users, label: "Users" },
    { icon: Settings, label: "Settings" },
];

const awsServices = [
    { name: "Transcribe", status: true },
    { name: "Bedrock", status: true },
    { name: "Polly", status: true },
    { name: "Lambda", status: true },
    { name: "DynamoDB", status: true },
    { name: "S3", status: true },
];

export default function AdminPage() {
    const [toastMessage, setToastMessage] = useState("");
    const [statusDropdown, setStatusDropdown] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleStatusUpdate = (id: string, newStatus: string) => {
        setStatusDropdown(null);
        showToast(`✅ ${id} updated to "${newStatus}" in DynamoDB`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Toast */}
            {toastMessage && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium">
                    {toastMessage}
                </div>
            )}

            {/* Sidebar */}
            <div className="w-64 bg-gray-900 min-h-screen p-4 flex flex-col fixed left-0 top-0">
                {/* Logo */}
                <div className="flex items-center gap-2 px-2 mb-8 mt-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Neta-ji</p>
                        <p className="text-gray-500 text-xs">Admin Panel</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1 flex-1">
                    {sidebarLinks.map((link) => (
                        <button
                            key={link.label}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active
                                    ? "bg-green-500/10 text-green-400"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <link.icon className="w-4 h-4" />
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* AWS Status in Sidebar */}
                <div className="mt-auto pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 px-2">
                        System Status
                    </p>
                    <div className="bg-gray-800/50 rounded-xl p-3">
                        <div className="grid grid-cols-2 gap-1.5">
                            {awsServices.map((s) => (
                                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    <span className="text-gray-400">{s.name}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-green-500 mt-2 text-center">
                            All systems operational
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Overview of all grievances and system metrics
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Total Grievances"
                        value={ADMIN_STATS.total.toLocaleString()}
                        icon={FileText}
                        color="green"
                        trend="+12% this month"
                        trendUp={true}
                    />
                    <StatsCard
                        title="Pending"
                        value={ADMIN_STATS.pending}
                        icon={AlertCircle}
                        color="yellow"
                        trend="23 new today"
                        trendUp={false}
                    />
                    <StatsCard
                        title="In Progress"
                        value={ADMIN_STATS.inProgress}
                        icon={Loader2}
                        color="blue"
                    />
                    <StatsCard
                        title="Resolved"
                        value={ADMIN_STATS.resolved}
                        icon={CheckCircle2}
                        color="green"
                        trend="63% resolution rate"
                        trendUp={true}
                    />
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                        <div className="p-3 bg-orange-50 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Today New</p>
                            <p className="text-xl font-bold text-gray-900">{ADMIN_STATS.todayNew}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Avg Resolution</p>
                            <p className="text-xl font-bold text-gray-900">{ADMIN_STATS.avgResolutionDays} days</p>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <AnalyticsChart
                        type="bar"
                        data={ADMIN_STATS.monthlyTrend}
                        title="📊 Monthly Trend — Submitted vs Resolved"
                    />
                    <AnalyticsChart
                        type="pie"
                        data={ADMIN_STATS.categoryBreakdown}
                        title="📈 Category Distribution"
                    />
                </div>

                {/* Recent Grievances Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">Recent Grievances</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                                        ID
                                    </th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                                        Category
                                    </th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                                        Location
                                    </th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                                        Date
                                    </th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                                        Status
                                    </th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_GRIEVANCES.map((g) => (
                                    <tr
                                        key={g.id}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 text-sm font-mono text-gray-600">{g.id}</td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                                                {g.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{g.location}</td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{g.date}</td>
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
                                                        Update Status <ChevronDown className="w-3 h-3 ml-1" />
                                                    </Button>

                                                    {statusDropdown === g.id && (
                                                        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[140px] z-50 animate-fade-in">
                                                            {["Pending", "In Progress", "Resolved"].map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => handleStatusUpdate(g.id, s)}
                                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700 transition-colors"
                                                                >
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AWS Services Status Bar */}
                <div className="mt-8 bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {awsServices.map((s) => (
                                <div key={s.name} className="flex items-center gap-2 text-sm">
                                    <span className="text-green-500">✅</span>
                                    <span className="text-gray-600">{s.name}</span>
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-green-600 font-medium">
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
