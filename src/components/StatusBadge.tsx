import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type StatusType = "Resolved" | "Pending" | "In Progress" | string;

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const { t } = useTranslation();
    const getStatusStyles = (s: StatusType) => {
        switch (s) {
            case "Resolved":
                return "bg-green-100 text-green-700 border-green-200";
            case "In Progress":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getIcon = (s: StatusType) => {
        switch (s) {
            case "Resolved":
                return "✅";
            case "In Progress":
                return "🔄";
            case "Pending":
                return "⏳";
            default:
                return "•";
        }
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                getStatusStyles(status),
                className
            )}
        >
            <span className="text-[10px]">{getIcon(status)}</span>
            {status === "Resolved" ? t('dashboard.resolved', status) : status === "In Progress" ? t('dashboard.in_progress', status) : status === "Pending" ? t('dashboard.pending', status) : status}
        </span>
    );
}
