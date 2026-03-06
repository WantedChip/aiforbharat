import { TOP_SCHEMES_BY_ENGAGEMENT } from "@/lib/adminMockData";

export default function TopSchemesTable() {
    return (
        <div
            className="bg-white rounded-xl border"
            style={{ borderColor: "#e2e8f0" }}
        >
            <div
                className="px-5 py-4 border-b"
                style={{ borderColor: "#e2e8f0" }}
            >
                <h3
                    className="text-sm font-semibold"
                    style={{ color: "#1e293b" }}
                >
                    Top Schemes by Engagement
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                            {["Rank", "Scheme Name", "Views", "Engagement"].map((h) => (
                                <th
                                    key={h}
                                    className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3"
                                    style={{ color: "#64748b" }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TOP_SCHEMES_BY_ENGAGEMENT.map((s) => (
                            <tr
                                key={s.rank}
                                className="hover:bg-gray-50/50 transition-colors"
                                style={{ borderBottom: "1px solid #f1f5f9" }}
                            >
                                <td className="px-5 py-3">
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{
                                            backgroundColor: "rgba(34,197,94,0.1)",
                                            color: "#22c55e",
                                        }}
                                    >
                                        {s.rank}
                                    </span>
                                </td>
                                <td
                                    className="px-5 py-3 text-sm font-medium"
                                    style={{ color: "#1e293b" }}
                                >
                                    {s.name}
                                </td>
                                <td
                                    className="px-5 py-3 text-sm"
                                    style={{ color: "#64748b" }}
                                >
                                    {s.views.toLocaleString()}
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: "#22c55e" }}
                                    >
                                        {s.engagement}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
