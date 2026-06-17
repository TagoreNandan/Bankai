import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { useTelemetryStore } from "../store/telemetryStore";

export default function RSSIChart() {
    const frames = useTelemetryStore(
        (s) => s.frames
    );

    const data = frames.slice(-40);

    return (
        <div className="rounded-xl border border-[#1c2630] bg-[#10161d] p-5 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30 flex flex-col justify-between h-full">
            <h3 className="mb-3 text-sm font-semibold tracking-wider text-[#00f3ff] uppercase">
                RSSI Signal Link Strength
            </h3>

            <div className="w-full h-[180px] mt-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -40, bottom: 0 }}>
                        <CartesianGrid stroke="#1c2630" strokeDasharray="3 3" opacity={0.25} />
                        <XAxis hide dataKey="timestamp" />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            labelFormatter={() => ""}
                            formatter={(value) => [
                                `${Number(value).toFixed(1)} dBm`,
                                "RSSI Strength",
                            ]}
                            contentStyle={{
                                backgroundColor: "#10161d",
                                border: "1px solid #1c2630",
                                borderRadius: "4px",
                                fontFamily: "JetBrains Mono, monospace",
                                fontSize: "11px",
                            }}
                            itemStyle={{
                                color: "#00f3ff",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="rssi"
                            stroke="#ff007f"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5, stroke: "#ff007f", strokeWidth: 2, fill: "#0b0f13" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#1c2630]/60">
                <div>
                    <div className="text-[10px] text-zinc-500 uppercase">Signal status</div>
                    <div className="text-xs font-bold text-[#00f3ff]">CONNECTED</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">Frequency</div>
                    <div className="text-xs font-bold text-zinc-300">2.4 GHz</div>
                </div>
            </div>
        </div>
    );
}