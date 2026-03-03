"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface BarChartData {
    month: string;
    submitted: number;
    resolved: number;
}

interface PieChartData {
    name: string;
    value: number;
    fill: string;
}

interface AnalyticsChartProps {
    type: "bar" | "pie";
    data: BarChartData[] | PieChartData[];
    title: string;
}

export default function AnalyticsChart({ type, data, title }: AnalyticsChartProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>

            {type === "bar" ? (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data as BarChartData[]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="submitted" fill="#22c55e" radius={[4, 4, 0, 0]} name="Submitted" />
                        <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={data as PieChartData[]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            label={((props: any) => `${props.name ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`) as any}
                            labelLine={{ stroke: "#9ca3af" }}
                        >
                            {(data as PieChartData[]).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
