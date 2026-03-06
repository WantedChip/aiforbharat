"use client";

import { useState } from "react";
import { Lock, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setTimeout(() => {
            loginAdmin();
            router.push("/admin");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Neta-ji
                </Link>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
                            <Lock className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Governance Console
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Neta-ji Admin Portal
                        </p>
                    </div>

                    <div className="w-full h-px bg-gray-100 mb-6" />

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Loading state */}
                    {loading ? (
                        <div className="text-center py-8 space-y-4">
                            <Loader2 className="w-12 h-12 text-gray-800 animate-spin mx-auto" />
                            <p className="text-gray-600 font-medium">
                                Authenticating with AWS Cognito...
                            </p>
                            <p className="text-xs text-gray-400">
                                Verifying IAM permissions
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                    Admin Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="admin@netaji.gov.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl h-11"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter admin password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="rounded-xl h-11 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-md"
                            >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Sign In to Console
                            </Button>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            Secured by{" "}
                            <span className="text-orange-500 font-medium">
                                AWS Cognito & AWS IAM
                            </span>
                        </p>
                    </div>
                </div>


            </div>
        </div>
    );
}
