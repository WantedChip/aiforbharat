"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Upload, Brain, MapPin, Database, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIProcessingOverlayProps {
    isOpen: boolean;
    onComplete: () => void;
}

const steps = [
    { icon: Upload, label: "Uploading to Amazon S3...", duration: 1000, emoji: "📤" },
    { icon: Brain, label: "Analyzing with AWS Bedrock...", duration: 1500, emoji: "🤖" },
    { icon: MapPin, label: "Mapping location...", duration: 1000, emoji: "📍" },
    { icon: Database, label: "Saving to DynamoDB...", duration: 1000, emoji: "💾" },
    { icon: CheckCircle, label: "Grievance Submitted!", duration: 500, emoji: "✅" },
];

export default function AIProcessingOverlay({ isOpen, onComplete }: AIProcessingOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState<boolean[]>(new Array(steps.length).fill(false));
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(0);
            setCompleted(new Array(steps.length).fill(false));
            setShowConfetti(false);
            return;
        }

        let stepIndex = 0;
        const runStep = () => {
            if (stepIndex >= steps.length) {
                setShowConfetti(true);
                setTimeout(() => onComplete(), 1000);
                return;
            }

            setCurrentStep(stepIndex);
            const timer = setTimeout(() => {
                setCompleted((prev) => {
                    const next = [...prev];
                    next[stepIndex] = true;
                    return next;
                });
                stepIndex++;
                runStep();
            }, steps[stepIndex].duration);

            return () => clearTimeout(timer);
        };

        runStep();
    }, [isOpen, onComplete]);

    if (!isOpen) return null;

    const progress = ((completed.filter(Boolean).length) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

            {/* Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
                {/* Confetti */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    backgroundColor: ["#22c55e", "#10b981", "#059669", "#fbbf24", "#3b82f6"][
                                        i % 5
                                    ],
                                    animation: `confetti ${0.5 + Math.random() * 1}s ease-out forwards`,
                                    animationDelay: `${Math.random() * 0.3}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        {showConfetti ? (
                            <PartyPopper className="w-8 h-8 text-green-600" />
                        ) : (
                            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {showConfetti ? "Success!" : "Processing Your Grievance"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {showConfetti ? "Your grievance has been filed" : "AI is analyzing your submission..."}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="space-y-3">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = index === currentStep && !completed[index];
                        const isDone = completed[index];

                        return (
                            <div
                                key={step.label}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300",
                                    isDone
                                        ? "bg-green-50"
                                        : isActive
                                            ? "bg-blue-50 border border-blue-100"
                                            : "opacity-40"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                        isDone
                                            ? "bg-green-100"
                                            : isActive
                                                ? "bg-blue-100"
                                                : "bg-gray-100"
                                    )}
                                >
                                    {isDone ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : isActive ? (
                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                    ) : (
                                        <StepIcon className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        isDone ? "text-green-700" : isActive ? "text-blue-700" : "text-gray-400"
                                    )}
                                >
                                    {step.emoji} {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
