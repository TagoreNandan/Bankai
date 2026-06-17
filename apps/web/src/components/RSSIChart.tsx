import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useTelemetryStore } from "../store/telemetryStore";

export default function RSSIChart() {
    const frames = useTelemetryStore(
        (s) => s.frames
    );

    return (
        <div className="rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                RSSI Signal
            </h3>

            <ResponsiveContainer
                width="100%"
                height={180}
            >
                <LineChart
                    data={frames.slice(-50)}
                >
                    <XAxis hide />

                    <YAxis
                        width={50}
                        domain={[0, 100]}
                    />

                    <Tooltip
                        labelFormatter={() => ""}
                        formatter={(value) => [
                            `${Number(value).toFixed(1)}`,
                            "RSSI",
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

                    <Line
                        type="monotone"
                        dataKey="rssi"
                        stroke="#22d3ee"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}