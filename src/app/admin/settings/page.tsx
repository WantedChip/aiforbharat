import { CheckCircle2, Wifi } from "lucide-react";

const settingSections = [
    {
        title: "AWS Configuration",
        icon: "☁️",
        items: [
            { label: "Region", value: "ap-south-1 (Mumbai)" },
            { label: "Bedrock Model", value: "Claude / Amazon Titan" },
            { label: "Transcribe", value: "Enabled (15 languages)" },
            { label: "Polly", value: "Enabled (Neural voices)" },
        ],
        status: "All Connected",
        statusOk: true,
    },
    {
        title: "WhatsApp Business API",
        icon: "💬",
        items: [
            { label: "Business Account", value: "Neta-ji Civic Connect" },
            { label: "Phone", value: "+91-XXXX-XXXXXX" },
            { label: "Messages this month", value: "48,291" },
        ],
        status: "Connected",
        statusOk: true,
    },
    {
        title: "Notification Preferences",
        icon: "🔔",
        items: [
            { label: "New grievance alert", value: "Enabled" },
            { label: "Broadcast delivery report", value: "Enabled" },
            { label: "Daily digest", value: "8:00 AM IST" },
        ],
        status: null,
        statusOk: true,
    },
    {
        title: "System Information",
        icon: "ℹ️",
        items: [
            { label: "Version", value: "MVP 1.0" },
            { label: "Environment", value: "Demo" },
            { label: "Last deployed", value: "Mar 2026" },
            { label: "Built for", value: "AI for Bharat Hackathon" },
        ],
        status: null,
        statusOk: true,
    },
];

export default function SettingsPage() {
    return (
        <>
            {/* Page Header */}
            <div className="mb-6">
                <p
                    className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1"
                    style={{ color: "#64748b" }}
                >
                    Configuration
                </p>
                <h1 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
                    Settings
                </h1>
            </div>

            {/* Settings Cards */}
            <div className="grid grid-cols-2 gap-6">
                {settingSections.map((section) => (
                    <div
                        key={section.title}
                        className="bg-white rounded-xl border p-5"
                        style={{ borderColor: "#e2e8f0" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{section.icon}</span>
                                <h3
                                    className="text-sm font-semibold"
                                    style={{ color: "#1e293b" }}
                                >
                                    {section.title}
                                </h3>
                            </div>
                            {section.status && (
                                <span
                                    className="flex items-center gap-1 text-xs font-medium"
                                    style={{
                                        color: section.statusOk ? "#22c55e" : "#ef4444",
                                    }}
                                >
                                    {section.statusOk ? (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    ) : (
                                        <Wifi className="w-3.5 h-3.5" />
                                    )}
                                    {section.status}
                                </span>
                            )}
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            {section.items.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between"
                                >
                                    <span
                                        className="text-sm"
                                        style={{ color: "#64748b" }}
                                    >
                                        {item.label}
                                    </span>
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: "#1e293b" }}
                                    >
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
