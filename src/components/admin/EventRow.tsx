interface EventRowProps {
    id: string;
    type: "Event" | "Notice";
    priority: string | null;
    title: string;
    description: string;
    date: string;
    location: string;
    status: string;
}

export default function EventRow({
    type,
    priority,
    title,
    description,
    date,
    location,
    status,
}: EventRowProps) {
    const isEvent = type === "Event";

    const statusStyles: Record<string, { bg: string; text: string }> = {
        Upcoming: { bg: "rgba(59,130,246,0.1)", text: "#3b82f6" },
        Active: { bg: "rgba(34,197,94,0.1)", text: "#22c55e" },
        Scheduled: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b" },
    };

    const priorityStyles: Record<string, { bg: string; text: string }> = {
        URGENT: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
        HIGH: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b" },
        MEDIUM: { bg: "rgba(59,130,246,0.1)", text: "#3b82f6" },
    };

    const st = statusStyles[status] || { bg: "#f1f5f9", text: "#64748b" };

    return (
        <div
            className="flex gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors"
            style={{ borderBottom: "1px solid #f1f5f9" }}
        >
            {/* Left indicator bar */}
            <div
                className="w-1 rounded-full shrink-0"
                style={{
                    backgroundColor: isEvent ? "#22c55e" : "#f59e0b",
                }}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {/* Type badge */}
                    <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: isEvent
                                ? "rgba(34,197,94,0.1)"
                                : "rgba(245,158,11,0.1)",
                            color: isEvent ? "#22c55e" : "#f59e0b",
                        }}
                    >
                        {isEvent ? "📅 Event" : "🔔 Notice"}
                    </span>

                    {/* Priority badge */}
                    {priority && priorityStyles[priority] && (
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                            style={{
                                backgroundColor: priorityStyles[priority].bg,
                                color: priorityStyles[priority].text,
                            }}
                        >
                            {priority}
                        </span>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Status badge */}
                    <span
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: st.bg, color: st.text }}
                    >
                        {status}
                    </span>
                </div>

                {/* Title */}
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#1e293b" }}>
                    {title}
                </p>

                {/* Description */}
                <p className="text-xs mb-1.5 line-clamp-1" style={{ color: "#64748b" }}>
                    {description}
                </p>

                {/* Date + Location */}
                <div className="flex items-center gap-4">
                    <span className="text-[11px]" style={{ color: "#94a3b8" }}>
                        🕐 {date}
                    </span>
                    <span className="text-[11px]" style={{ color: "#94a3b8" }}>
                        📍 {location}
                    </span>
                </div>
            </div>
        </div>
    );
}
