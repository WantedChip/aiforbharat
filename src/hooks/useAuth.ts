"use client";
import { useState, useEffect } from "react";
import { isUserLoggedIn, isAdminLoggedIn, getUserPhone } from "@/lib/auth";

export function useAuth() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoggedIn(isUserLoggedIn());
        setAdminLoggedIn(isAdminLoggedIn());
        setPhone(getUserPhone());
        setLoading(false);
    }, []);

    return { loggedIn, adminLoggedIn, phone, loading };
}
