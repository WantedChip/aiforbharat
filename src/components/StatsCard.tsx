import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: "green" | "yellow" | "blue" | "red" | "purple";
    className?: string;
}

const colorMap = {
    green: {
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        border: "border-green-100",
    },
    yellow: {
        bg: "bg-yellow-50",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        border: "border-yellow-100",
    },
    blue: {
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        border: "border-blue-100",
    },
    red: {
        bg: "bg-red-50",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        border: "border-red-100",
    },
    purple: {
        bg: "bg-purple-50",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        border: "border-purple-100",
    },
};

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    color = "green",
    className,
}: StatsCardProps) {
    const colors = colorMap[color];

    return (
        <div
            className={cn(
                "rounded-xl border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                colors.bg,
                colors.border,
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {trend && (
                        <p
                            className={cn(
                                "text-xs mt-1 font-medium",
                                trendUp ? "text-green-600" : "text-red-500"
                            )}
                        >
                            {trendUp ? "↑" : "↓"} {trend}
                        </p>
                    )}
                </div>
                <div className={cn("p-2.5 rounded-xl", colors.iconBg)}>
                    <Icon className={cn("w-5 h-5", colors.iconColor)} />
                </div>
            </div>
        </div>
    );
}
