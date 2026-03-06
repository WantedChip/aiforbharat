"use client";

import { useState } from "react";
import { User, MapPin, FileText, Search, Plus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_GRIEVANCES, MOCK_SCHEMES } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComplaintCard from "@/components/ComplaintCard";
import SchemeCard from "@/components/SchemeCard";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

type FilterType = "All" | "Pending" | "In Progress" | "Resolved";

function DashboardPageInner() {
    const [activeTab, setActiveTab] = useState<"grievances" | "schemes">("grievances");
    const [filter, setFilter] = useState<FilterType>("All");
    const [toastMessage, setToastMessage] = useState("");

    const filteredGrievances =
        filter === "All"
            ? MOCK_GRIEVANCES
            : MOCK_GRIEVANCES.filter((g) => g.status === filter);

    const stats = {
        total: MOCK_GRIEVANCES.length,
        resolved: MOCK_GRIEVANCES.filter((g) => g.status === "Resolved").length,
        pending: MOCK_GRIEVANCES.filter((g) => g.status === "Pending").length,
        inProgress: MOCK_GRIEVANCES.filter((g) => g.status === "In Progress").length,
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <Navbar />

            {/* Toast */}
            {toastMessage && (
                <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium">
                    {toastMessage}
                </div>
            )}

            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                            {/* User Info */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/20">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Ramesh Kumar</h2>
                                <p className="text-sm text-gray-500">+91 98XXX XXXXX</p>
                                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-1">
                                    <MapPin className="w-3 h-3" /> Lucknow, UP
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <div className="bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                                    <p className="text-xs text-gray-500">Total</p>
                                </div>
                                <div className="bg-green-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-green-600">{stats.resolved}</p>
                                    <p className="text-xs text-gray-500">Resolved</p>
                                </div>
                                <div className="bg-yellow-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
                                    <p className="text-xs text-gray-500">Pending</p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold text-blue-600">{stats.inProgress}</p>
                                    <p className="text-xs text-gray-500">In Progress</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-2">
                                <Link href="/report" className="block">
                                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl h-10">
                                        <PlusCircle className="w-4 h-4 mr-2" /> New Grievance
                                    </Button>
                                </Link>
                                <Link href="/schemes" className="block">
                                    <Button variant="outline" className="w-full rounded-xl h-10">
                                        <Search className="w-4 h-4 mr-2" /> Find Schemes
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-6 shadow-sm">
                            <button
                                onClick={() => setActiveTab("grievances")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "grievances"
                                    ? "bg-green-500 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <FileText className="w-4 h-4 inline mr-1.5" />
                                My Grievances
                            </button>
                            <button
                                onClick={() => setActiveTab("schemes")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "schemes"
                                    ? "bg-green-500 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <Search className="w-4 h-4 inline mr-1.5" />
                                Scheme Eligibility
                            </button>
                        </div>

                        {/* Grievances Tab */}
                        {activeTab === "grievances" && (
                            <div>
                                {/* Filter Bar */}
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                                    {(["All", "Pending", "In Progress", "Resolved"] as FilterType[]).map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === f
                                                ? "bg-green-500 text-white shadow-sm"
                                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {f}
                                            {f !== "All" && (
                                                <span className="ml-1.5 text-xs opacity-70">
                                                    ({MOCK_GRIEVANCES.filter((g) => g.status === f).length})
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Grievance Cards */}
                                <div className="space-y-4">
                                    {filteredGrievances.map((g) => (
                                        <ComplaintCard key={g.id} {...g} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Schemes Tab */}
                        {activeTab === "schemes" && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {MOCK_SCHEMES.map((scheme) => (
                                    <SchemeCard
                                        key={scheme.id}
                                        {...scheme}
                                        onApply={() =>
                                            showToast("Redirecting to official portal...")
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardPageInner />
        </ProtectedRoute>
    );
}
