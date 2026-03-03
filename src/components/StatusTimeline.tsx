import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TimelineStep {
    step: string;
    done: boolean;
    date: string;
}

interface StatusTimelineProps {
    steps: TimelineStep[];
    className?: string;
}

export default function StatusTimeline({ steps, className }: StatusTimelineProps) {
    // Find current step index (last done step)
    const currentIndex = steps.reduce(
        (acc, step, i) => (step.done ? i : acc),
        -1
    );

    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-start justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 mx-8" />
                <div
                    className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-8 transition-all duration-500"
                    style={{
                        width:
                            currentIndex >= 0
                                ? `calc(${(currentIndex / (steps.length - 1)) * 100}% - 4rem)`
                                : "0%",
                    }}
                />

                {steps.map((step, index) => {
                    const isCompleted = step.done;
                    const isCurrent = index === currentIndex && !steps[steps.length - 1].done;
                    const isFuture = !step.done;

                    return (
                        <div
                            key={step.step}
                            className="flex flex-col items-center relative z-10 flex-1"
                        >
                            {/* Circle */}
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    isCompleted && !isCurrent
                                        ? "bg-green-500 border-green-500 text-white"
                                        : isCurrent
                                            ? "bg-white border-green-500 shadow-lg shadow-green-500/30"
                                            : "bg-white border-gray-300"
                                )}
                            >
                                {isCompleted && !isCurrent ? (
                                    <Check className="w-4 h-4" />
                                ) : isCurrent ? (
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                ) : (
                                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    "text-xs mt-2 text-center font-medium max-w-[80px]",
                                    isCompleted ? "text-green-700" : isFuture ? "text-gray-400" : "text-gray-600"
                                )}
                            >
                                {step.step}
                            </span>

                            {/* Date */}
                            {step.date && (
                                <span className="text-[10px] text-gray-400 mt-0.5">{step.date}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
