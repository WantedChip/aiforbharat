import { STATE_BREAKDOWN } from "@/lib/adminMockData";

export default function StateBreakdownGrid() {
    return (
        <div>
            <h3
                className="text-sm font-semibold mb-4"
                style={{ color: "#1e293b" }}
            >
                State Breakdown — National Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {STATE_BREAKDOWN.map((s) => (
                    <div
                        key={s.state}
                        className="bg-white rounded-xl border p-4"
                        style={{ borderColor: "#e2e8f0" }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <p
                                className="text-sm font-semibold"
                                style={{ color: "#1e293b" }}
                            >
                                {s.state}
                            </p>
                            <span
                                className="text-xs font-bold"
                                style={{ color: "#22c55e" }}
                            >
                                {s.active}%
                            </span>
                        </div>
                        <p
                            className="text-xl font-bold mb-0.5"
                            style={{ color: "#1e293b" }}
                        >
                            {s.subscribers.toLocaleString()}
                        </p>
                        <p
                            className="text-[11px] mb-3"
                            style={{ color: "#94a3b8" }}
                        >
                            subscribers
                        </p>
                        {/* Progress bar */}
                        <div
                            className="w-full h-1.5 rounded-full"
                            style={{ backgroundColor: "#f1f5f9" }}
                        >
                            <div
                                className="h-1.5 rounded-full"
                                style={{
                                    width: `${s.active}%`,
                                    backgroundColor: "#22c55e",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
