"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isUserLoggedIn } from "@/lib/auth";

interface Props {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (isUserLoggedIn()) {
            setAuthorized(true);
        } else {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [router, pathname]);

    if (!authorized) return null;

    return <>{children}</>;
}
