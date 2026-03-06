"use client";

import { useState } from "react";
import { Search, Loader2, Brain, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_SCHEMES } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemeCard from "@/components/SchemeCard";
import VoiceDemo from "@/components/VoiceDemo";
import ProtectedRoute from "@/components/ProtectedRoute";

function SchemesPageInner() {
    const [step, setStep] = useState(0);
    const [occupation, setOccupation] = useState("");
    const [age, setAge] = useState("");
    const [income, setIncome] = useState("");
    const [checking, setChecking] = useState(false);
    const [results, setResults] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const occupations = ["Farmer", "Laborer", "Student", "Small Business", "Other"];
    const incomeRanges = [
        "Below ₹1 Lakh",
        "₹1-3 Lakh",
        "₹3-5 Lakh",
        "₹5-10 Lakh",
        "Above ₹10 Lakh",
    ];

    const handleCheck = () => {
        setChecking(true);
        setTimeout(() => {
            setChecking(false);
            setResults(true);
        }, 2000);
    };

    const resetChecker = () => {
        setStep(0);
        setOccupation("");
        setAge("");
        setIncome("");
        setResults(false);
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const eligibleSchemes = MOCK_SCHEMES.filter((s) => s.eligible);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <Navbar />

            {/* Toast */}
            {toastMessage && (
                <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium">
                    {toastMessage}
                </div>
            )}

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Find Government Schemes You&apos;re Eligible For
                    </h1>
                    <p className="text-green-100 text-lg">
                        AI-powered matching across 100+ central & state schemes
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-10 px-4">
                {/* Interactive Eligibility Checker */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 mb-12 -mt-8 relative z-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
                        🎯 Interactive Eligibility Checker
                    </h2>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Answer a few questions to find schemes tailored for you
                    </p>

                    {/* Checking Animation */}
                    {checking && (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 mx-auto bg-purple-50 rounded-full flex items-center justify-center">
                                <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
                            </div>
                            <p className="text-purple-600 font-medium">Analyzing with AWS Bedrock...</p>
                            <p className="text-xs text-gray-400">Matching your profile with 100+ schemes</p>
                            <div className="w-48 h-1.5 bg-gray-100 rounded-full mx-auto overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-[progress-fill_2s_ease-out_forwards]" />
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {results && !checking && (
                        <div className="space-y-4 animate-slide-up">
                            <div className="text-center mb-4">
                                <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">🎉</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900">
                                    {eligibleSchemes.length} Schemes Found!
                                </p>
                                <p className="text-sm text-gray-500">Based on your profile</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {eligibleSchemes.map((s) => (
                                    <SchemeCard
                                        key={s.id}
                                        {...s}
                                        onApply={() => showToast("Redirecting to official portal...")}
                                    />
                                ))}
                            </div>
                            <div className="text-center pt-4">
                                <Button variant="outline" onClick={resetChecker} className="rounded-xl">
                                    Check Again
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Steps */}
                    {!checking && !results && (
                        <div className="space-y-6">
                            {/* Progress dots */}
                            <div className="flex justify-center gap-2 mb-4">
                                {[0, 1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${s <= step
                                            ? "bg-green-500 scale-110"
                                            : "bg-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Step 1: Occupation */}
                            {step === 0 && (
                                <div className="animate-fade-in">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        Step 1: What is your occupation?
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {occupations.map((o) => (
                                            <button
                                                key={o}
                                                onClick={() => {
                                                    setOccupation(o);
                                                    setStep(1);
                                                }}
                                                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:border-green-400 hover:bg-green-50 ${occupation === o
                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                    : "border-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {o}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Age */}
                            {step === 1 && (
                                <div className="animate-fade-in">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        Step 2: What is your age?
                                    </p>
                                    <div className="flex gap-3 max-w-xs">
                                        <Input
                                            type="number"
                                            placeholder="Enter age"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="rounded-xl h-11"
                                        />
                                        <Button
                                            onClick={() => age && setStep(2)}
                                            disabled={!age}
                                            className="rounded-xl bg-green-500 hover:bg-green-600"
                                        >
                                            Next →
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Income */}
                            {step === 2 && (
                                <div className="animate-fade-in">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        Step 3: What is your annual income?
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {incomeRanges.map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => {
                                                    setIncome(range);
                                                    setStep(3);
                                                }}
                                                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:border-green-400 hover:bg-green-50 ${income === range
                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                    : "border-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Check */}
                            {step === 3 && (
                                <div className="animate-fade-in text-center">
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4 max-w-sm mx-auto text-left space-y-2">
                                        <p className="text-sm">
                                            <span className="text-gray-400">Occupation:</span>{" "}
                                            <span className="font-medium text-gray-700">{occupation}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-400">Age:</span>{" "}
                                            <span className="font-medium text-gray-700">{age} years</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-400">Income:</span>{" "}
                                            <span className="font-medium text-gray-700">{income}</span>
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleCheck}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl h-11 px-8"
                                    >
                                        <Search className="w-4 h-4 mr-2" /> Check Eligibility
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* All Schemes Grid */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">All Government Schemes</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {MOCK_SCHEMES.map((scheme) => (
                            <SchemeCard
                                key={scheme.id}
                                {...scheme}
                                onApply={() => showToast("Redirecting to official portal...")}
                            />
                        ))}
                    </div>
                </div>

                {/* Voice Demo Section */}
                <div className="text-center mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        🎤 Try with Voice on WhatsApp
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Speak in your language — our AI understands Hindi, Tamil, Telugu & more
                    </p>
                    <VoiceDemo />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function SchemesPage() {
    return (
        <ProtectedRoute>
            <SchemesPageInner />
        </ProtectedRoute>
    );
}
