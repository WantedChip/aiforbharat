"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Radio,
    CalendarDays,
    BarChart3,
    Users,
    Settings,
    LogOut,
} from "lucide-react";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Grievances", href: "/admin/grievances" },
    { icon: Radio, label: "Broadcasts", href: "/admin/broadcasts" },
    { icon: CalendarDays, label: "Events & Notices", href: "/admin/events" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 w-[260px] h-screen flex flex-col"
            style={{ backgroundColor: "#0f172a" }}
        >
            {/* Logo */}
            <div className="px-5 pt-6 pb-2">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #22c55e, #059669)" }}
                    >
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <div>
                        <p className="text-white font-bold text-[15px] leading-tight">Neta-ji</p>
                        <p className="text-[11px] leading-tight" style={{ color: "#64748b" }}>
                            Governance Console
                        </p>
                    </div>
                </div>
            </div>

            {/* Section Label */}
            <div className="px-5 pt-4 pb-2">
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase"
                    style={{ color: "#475569" }}
                >
                    Governance Console
                </p>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative"
                            style={{
                                backgroundColor: active ? "#1e293b" : "transparent",
                                color: active ? "#ffffff" : "#94a3b8",
                                borderLeft: active ? "3px solid #22c55e" : "3px solid transparent",
                            }}
                        >
                            <item.icon className="w-[18px] h-[18px]" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: Admin Info */}
            <div className="px-4 pb-5 pt-3" style={{ borderTop: "1px solid #1e293b" }}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: "#1e293b", color: "#94a3b8" }}
                    >
                        AO
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium leading-tight">Admin Operator</p>
                        <p className="text-[11px] leading-tight" style={{ color: "#64748b" }}>
                            India · National Admin
                        </p>
                    </div>
                </div>
                <button
                    className="flex items-center gap-2 text-xs font-medium transition-colors"
                    style={{ color: "#64748b" }}
                    onClick={() => { }}
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
