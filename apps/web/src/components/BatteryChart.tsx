import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";

import { CartesianGrid, Tooltip } from "recharts";

import { useTelemetryStore } from "../store/telemetryStore";

export default function BatteryChart() {
    const frames = useTelemetryStore(
        (s) => s.frames
    );

    return (
        <div className="rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Battery
            </h3>

            <ResponsiveContainer
                width="100%"
                height={220}
            >
                <AreaChart data={frames.slice(-50)}>
                    <XAxis hide />

                    <YAxis
                        width={35}
                        domain={[0, 100]}
                    />

                    <Tooltip
                        labelFormatter={() => ""}
                        formatter={(value) => [
                            `${Number(value).toFixed(1)}%`,
                            "Battery",
                        ]}
                        contentStyle={{
                            backgroundColor: "#111827",
                            border: "1px solid #22d3ee",
                            borderRadius: "8px",
                        }}
                        itemStyle={{
                            color: "#22d3ee",
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="battery"
                        stroke="#22d3ee"
                        fill="#164e63"
                    />
                </AreaChart>

                <CartesianGrid
                    stroke="#0f172a"
                    strokeDasharray="3 3"
                />
            </ResponsiveContainer>
        </div>
    );
}