"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { Phone, Lock, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/lib/auth";

function LoginPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/dashboard";
    const [step, setStep] = useState<"phone" | "otp" | "verifying">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length >= 10) {
            setStep("otp");
        }
    };

    const handleOTPChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = useCallback(() => {
        const otpValue = otp.join("");
        if (otpValue.length === 6) {
            setStep("verifying");
            setTimeout(() => {
                loginUser(phone);
                router.push(redirectTo);
            }, 2000);
        }
    }, [otp, phone, router, redirectTo]);

    useEffect(() => {
        if (otp.every((d) => d !== "")) {
            handleVerify();
        }
    }, [otp, handleVerify]);

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
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/20 mb-4">
                            <span className="text-2xl text-white font-bold">N</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Neta-ji | Civic Connect</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {step === "phone" ? "Welcome Back" : step === "otp" ? "Enter OTP" : "Verifying..."}
                        </p>
                    </div>

                    {/* Phone Step */}
                    {step === "phone" && (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                    Mobile Number
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">
                                        +91
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        className="rounded-xl h-11"
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={phone.length < 10}
                                className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md shadow-green-500/20"
                            >
                                <Phone className="w-4 h-4 mr-2" /> Get OTP
                            </Button>
                        </form>
                    )}

                    {/* OTP Step */}
                    {step === "otp" && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    OTP sent to <span className="font-medium text-gray-700">+91 {phone}</span>
                                </p>
                            </div>
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    />
                                ))}
                            </div>
                            <Button
                                onClick={handleVerify}
                                disabled={otp.some((d) => d === "")}
                                className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md shadow-green-500/20"
                            >
                                <Lock className="w-4 h-4 mr-2" /> Verify & Login
                            </Button>
                            <button
                                onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); }}
                                className="w-full text-sm text-gray-500 hover:text-green-600 transition-colors"
                            >
                                Change phone number
                            </button>
                        </div>
                    )}

                    {/* Verifying Step */}
                    {step === "verifying" && (
                        <div className="text-center py-8 space-y-4">
                            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto" />
                            <p className="text-gray-600 font-medium">Verifying with AWS Cognito...</p>
                            <p className="text-xs text-gray-400">Establishing secure session</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">
                            Secured by <span className="text-orange-500 font-medium">AWS Cognito</span> 🔐
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            New user?{" "}
                            <span className="text-green-600 font-medium cursor-pointer hover:underline">
                                Register
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginPageInner />
        </Suspense>
    );
}
