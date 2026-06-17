import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useTelemetryStore } from "../store/telemetryStore";

export default function BatteryChart() {
    const frames = useTelemetryStore(
        (s) => s.frames
    );

    const data = frames.slice(-40);

    // Calculate simulated consumption stats from battery level
    const latestBattery = data.length > 0 ? data[data.length - 1].battery : 0;
    const avgConsumption = (4.2 + (100 - latestBattery) * 0.05).toFixed(1);
    const peakConsumption = (5.8 + (100 - latestBattery) * 0.08).toFixed(1);

    return (
        <div className="flex h-full flex-col justify-between rounded-xl border border-[#1c2630] bg-[#10161d] p-5 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold tracking-wider text-[#00f3ff] uppercase">
                    Battery Consumption Trend
                </span>
            </div>

            <div className="relative w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: -40, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <XAxis hide dataKey="timestamp" />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            labelFormatter={() => ""}
                            formatter={(value) => [
                                `${Number(value).toFixed(1)}%`,
                                "Battery Level",
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
                        <Area
                            type="monotone"
                            dataKey="battery"
                            stroke="#00f3ff"
                            strokeWidth={2}
                            fill="url(#colorConsumption)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#1c2630]/60">
                <div>
                    <div className="text-[10px] text-zinc-500 uppercase">Average</div>
                    <div className="text-xs font-bold text-[#00f3ff]">{avgConsumption} kW/h</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">Peak</div>
                    <div className="text-xs font-bold text-[#ff007f]">{peakConsumption} kW/h</div>
                </div>
            </div>
        </div>
    );
}