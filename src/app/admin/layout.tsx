"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Don't wrap the login page with auth protection or sidebar
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
                <AdminSidebar />
                <main className="flex-1 ml-[260px] p-8 overflow-y-auto min-h-screen">
                    {children}
                </main>
            </div>
        </AdminProtectedRoute>
    );
}
