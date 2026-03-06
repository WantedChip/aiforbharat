import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "#f8fafc" }}>
            <AdminSidebar />
            <main className="flex-1 ml-[260px] p-8 overflow-y-auto min-h-screen">
                {children}
            </main>
        </div>
    );
}
