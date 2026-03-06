"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EVENTS_AND_NOTICES } from "@/lib/adminMockData";
import EventRow from "@/components/admin/EventRow";

type FilterTab = "All" | "Event" | "Notice";

export default function EventsPage() {
    const [toastMessage, setToastMessage] = useState("");
    const [activeTab, setActiveTab] = useState<FilterTab>("All");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const filtered =
        activeTab === "All"
            ? EVENTS_AND_NOTICES
            : EVENTS_AND_NOTICES.filter((e) =>
                activeTab === "Event" ? e.type === "Event" : e.type === "Notice"
            );

    const tabs: FilterTab[] = ["All", "Event", "Notice"];

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
                        Communications
                    </p>
                    <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                        Events & Notices
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* Item count */}
                    <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
                        {filtered.length} items
                    </span>

                    <button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                        style={{ backgroundColor: "#1e293b" }}
                        onClick={() =>
                            showToast("📅 Event creator — opens in production")
                        }
                    >
                        <Plus className="w-4 h-4" />
                        Create New
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                            backgroundColor:
                                activeTab === tab ? "#1e293b" : "transparent",
                            color: activeTab === tab ? "#ffffff" : "#64748b",
                        }}
                    >
                        {tab === "All"
                            ? "All Items"
                            : tab === "Event"
                                ? "Events"
                                : "Notices"}
                    </button>
                ))}
            </div>

            {/* Events List */}
            <div
                className="bg-white rounded-xl border"
                style={{ borderColor: "#e2e8f0" }}
            >
                {filtered.map((item) => (
                    <EventRow key={item.id} {...item} />
                ))}
                {filtered.length === 0 && (
                    <div
                        className="px-5 py-8 text-center text-sm"
                        style={{ color: "#94a3b8" }}
                    >
                        No items match your filter.
                    </div>
                )}
            </div>
        </>
    );
}
