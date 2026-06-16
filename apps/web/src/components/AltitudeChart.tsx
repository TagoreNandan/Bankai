import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";

import { useTelemetryStore } from "../store/telemetryStore";

export default function AltitudeChart() {
    const frames = useTelemetryStore(
        (s) => s.frames
    );

    return (
        <div className="h-80 rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Altitude Profile
            </h3>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={frames}>
                    <XAxis hide />
                    <YAxis />

                    <Line
                        type="monotone"
                        dataKey="altitude"
                        stroke="#22d3ee"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}