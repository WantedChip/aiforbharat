"use client";

import { useState, useEffect } from "react";
import { Mic, Loader2, Brain, CheckCircle, RotateCcw } from "lucide-react";
import { MOCK_SCHEMES } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type DemoState = "idle" | "recording" | "transcribing" | "analyzing" | "result";

export default function VoiceDemo() {
    const { t } = useTranslation();
    const [state, setState] = useState<DemoState>("idle");
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (state === "recording") {
            interval = setInterval(() => setTimer((t) => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [state]);

    const startDemo = () => {
        setState("recording");
        setTimer(0);

        setTimeout(() => {
            setState("transcribing");
            setTimeout(() => {
                setState("analyzing");
                setTimeout(() => {
                    setState("result");
                }, 2000);
            }, 1500);
        }, 3000);
    };

    const reset = () => {
        setState("idle");
        setTimer(0);
    };

    const eligibleSchemes = MOCK_SCHEMES.filter((s) => s.eligible);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 text-center">
                {/* Idle */}
                {state === "idle" && (
                    <div className="space-y-4">
                        <button
                            onClick={startDemo}
                            className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 group"
                        >
                            <Mic className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                        </button>
                        <p className="text-gray-600 font-medium">{t('voice.tap_speak')}</p>
                        <p className="text-xs text-gray-400">{t('voice.powered_by')}</p>
                    </div>
                )}

                {/* Recording */}
                {state === "recording" && (
                    <div className="space-y-4">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse-ring opacity-30" />
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse-ring opacity-20 animation-delay-500" style={{ animationDelay: "0.5s" }} />
                            <div className="relative w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30">
                                <Mic className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-[2px] h-8">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[3px] rounded-full bg-red-400 animate-waveform"
                                    style={{
                                        animationDelay: `${i * 0.04}s`,
                                        height: `${4 + Math.random() * 20}px`,
                                    }}
                                />
                            ))}
                        </div>
                        <p className="text-red-600 font-medium">
                            {t('voice.recording')} 0:{timer.toString().padStart(2, "0")}
                        </p>
                    </div>
                )}

                {/* Transcribing */}
                {state === "transcribing" && (
                    <div className="space-y-4">
                        <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                        <p className="text-blue-600 font-medium">{t('voice.transcribing')}</p>
                        <p className="text-xs text-gray-400">{t('voice.converting')}</p>
                    </div>
                )}

                {/* Analyzing */}
                {state === "analyzing" && (
                    <div className="space-y-4">
                        <div className="w-24 h-24 mx-auto bg-purple-50 rounded-full flex items-center justify-center">
                            <Brain className="w-10 h-10 text-purple-600 animate-pulse" />
                        </div>
                        <p className="text-purple-600 font-medium">{t('voice.analyzing')}</p>
                        <p className="text-xs text-gray-400">{t('voice.criteria')}</p>
                    </div>
                )}

                {/* Result */}
                {state === "result" && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-slide-up">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-green-700 font-bold text-lg">{eligibleSchemes.length} {t('schemes.found')}</p>

                        <div className="space-y-2 text-left">
                            {eligibleSchemes.map((scheme, i) => (
                                <div
                                    key={scheme.scheme_id}
                                    className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100 animate-slide-up"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                >
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{scheme.scheme_name}</p>
                                        <p className="text-xs text-gray-500">{scheme.full_name}</p>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">{scheme.benefit_amount}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={reset}
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-xl",
                                "bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
                            )}
                        >
                            <RotateCcw className="w-4 h-4" /> {t('voice.try_again')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
