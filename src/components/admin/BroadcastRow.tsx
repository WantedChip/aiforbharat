interface BroadcastRowProps {
    id: string;
    title: string;
    subscribers: number;
    date: string;
    status: string;
    deliveryRate: number | null;
    readRate: number | null;
    category: string;
}

export default function BroadcastRow({
    title,
    subscribers,
    date,
    status,
    deliveryRate,
    readRate,
}: BroadcastRowProps) {
    const statusIcon =
        status === "Delivered"
            ? "✅"
            : status === "Scheduled"
                ? "⏰"
                : "📝";

    const statusColor =
        status === "Delivered"
            ? "#22c55e"
            : status === "Scheduled"
                ? "#f59e0b"
                : "#94a3b8";

    return (
        <div
            className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors"
            style={{ borderBottom: "1px solid #f1f5f9" }}
        >
            {/* Status icon + label */}
            <div className="flex items-center gap-2 w-[100px] shrink-0">
                <span className="text-sm">{statusIcon}</span>
                <span
                    className="text-xs font-semibold"
                    style={{ color: statusColor }}
                >
                    {status}
                </span>
            </div>

            {/* Title + meta */}
            <div className="flex-1 min-w-0">
                <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "#1e293b" }}
                >
                    {title}
                </p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>
                    👥 {subscribers.toLocaleString()} subscribers · {date}
                </p>
            </div>

            {/* Delivery + Read rates */}
            <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                    <p
                        className="text-[11px] uppercase tracking-wide"
                        style={{ color: "#94a3b8" }}
                    >
                        Delivery
                    </p>
                    <p className="text-sm font-bold" style={{ color: "#1e293b" }}>
                        {deliveryRate !== null ? `${deliveryRate}%` : "—"}
                    </p>
                </div>
                <div className="text-right">
                    <p
                        className="text-[11px] uppercase tracking-wide"
                        style={{ color: "#94a3b8" }}
                    >
                        Read
                    </p>
                    <p className="text-sm font-bold" style={{ color: "#1e293b" }}>
                        {readRate !== null ? `${readRate}%` : "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}
