// Simulated auth — no real backend needed

export const AUTH_KEYS = {
    isLoggedIn: "netaji_logged_in",
    isAdminLoggedIn: "netaji_admin_logged_in",
    userPhone: "netaji_user_phone",
};

export const DEMO_ADMIN_CREDENTIALS = {
    email: "admin@netaji.gov.in",
    password: "Admin@1234",
};

export function loginUser(phone: string) {
    localStorage.setItem(AUTH_KEYS.isLoggedIn, "true");
    localStorage.setItem(AUTH_KEYS.userPhone, phone);
}

export function loginAdmin() {
    localStorage.setItem(AUTH_KEYS.isAdminLoggedIn, "true");
}

export function logoutUser() {
    localStorage.removeItem(AUTH_KEYS.isLoggedIn);
    localStorage.removeItem(AUTH_KEYS.userPhone);
}

export function logoutAdmin() {
    localStorage.removeItem(AUTH_KEYS.isAdminLoggedIn);
}

export function isUserLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEYS.isLoggedIn) === "true";
}

export function isAdminLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEYS.isAdminLoggedIn) === "true";
}

export function getUserPhone(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(AUTH_KEYS.userPhone) || "";
}
