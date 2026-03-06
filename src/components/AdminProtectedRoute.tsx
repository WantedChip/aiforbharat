"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";

interface Props {
    children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: Props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (isAdminLoggedIn()) {
            setAuthorized(true);
        } else {
            router.push("/admin/login");
        }
    }, [router]);

    if (!authorized) return null;

    return <>{children}</>;
}
