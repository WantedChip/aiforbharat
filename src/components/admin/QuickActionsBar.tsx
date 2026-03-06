"use client";

import { Plus, Radio, CalendarDays, Download } from "lucide-react";

const actions = [
    {
        icon: Plus,
        label: "Add Scheme",
        subtitle: "Create & Publish",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.08)",
    },
    {
        icon: Radio,
        label: "New Broadcast",
        subtitle: "Send Update",
        color: "#3b82f6",
        bg: "rgba(59,130,246,0.08)",
    },
    {
        icon: CalendarDays,
        label: "Create Event",
        subtitle: "Schedule Notice",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.08)",
    },
    {
        icon: Download,
        label: "Import Data",
        subtitle: "Bulk Upload",
        color: "#8b5cf6",
        bg: "rgba(139,92,246,0.08)",
    },
];

interface QuickActionsBarProps {
    onAction?: (label: string) => void;
}

export default function QuickActionsBar({ onAction }: QuickActionsBarProps) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {actions.map((action) => (
                <button
                    key={action.label}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-left hover:shadow-md transition-all group"
                    onClick={() => onAction?.(action.label)}
                >
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: action.bg }}
                    >
                        <action.icon className="w-[18px] h-[18px]" style={{ color: action.color }} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {action.label}
                    </p>
                    <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">
                        {action.subtitle}
                    </p>
                </button>
            ))}
        </div>
    );
}
