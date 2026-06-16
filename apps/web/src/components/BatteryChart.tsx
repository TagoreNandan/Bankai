import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";

import { useTelemetryStore } from "../store/telemetryStore";

export default function BatteryChart() {
    const frames = useTelemetryStore(
        (s) => s.frames
    );

    return (
        <div className="h-80 rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Battery
            </h3>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={frames}>
                    <XAxis hide />
                    <YAxis />

                    <Area
                        type="monotone"
                        dataKey="battery"
                        stroke="#22d3ee"
                        fill="#164e63"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}