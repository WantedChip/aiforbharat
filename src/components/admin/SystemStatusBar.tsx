const awsServices = [
    { name: "Transcribe", status: true },
    { name: "Bedrock", status: true },
    { name: "Polly", status: true },
    { name: "Lambda", status: true },
    { name: "DynamoDB", status: true },
    { name: "S3", status: true },
];

export default function SystemStatusBar() {
    return (
        <div
            className="bg-white rounded-xl border p-4"
            style={{ borderColor: "#e2e8f0" }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {awsServices.map((s) => (
                        <div key={s.name} className="flex items-center gap-2 text-sm">
                            <span className="text-green-500">✅</span>
                            <span style={{ color: "#64748b" }}>{s.name}</span>
                        </div>
                    ))}
                </div>
                <span className="text-xs font-medium" style={{ color: "#22c55e" }}>
                    All systems operational
                </span>
            </div>
        </div>
    );
}
