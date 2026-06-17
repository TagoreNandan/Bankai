import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
} from "recharts";

import { useTelemetryStore } from "../store/telemetryStore";

export default function AltitudeChart() {
    const frames = useTelemetryStore(
        (s) => s.frames
    );

    const data = frames.slice(-50); // Plot last 50 data points

    return (
        <div className="rounded-xl border-2 border-[#1c2630] bg-[#10161d] p-6 text-xs font-mono relative overflow-hidden transition-all duration-300 hover:border-[#00f3ff]/40 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            
            {/* Top Tactical Label HUD */}
            <div className="flex items-center justify-between mb-4 border-b border-[#1c2630] pb-3">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#00f3ff] animate-pulse shadow-[0_0_8px_#00f3ff]" />
                    <span className="text-sm font-bold tracking-widest text-[#00f3ff] uppercase font-sans">
                        ALTITUDE PROFILE
                    </span>
                </div>
                <div className="flex items-center gap-4 text-[9px] text-zinc-500 font-semibold uppercase">
                    <div>Range: 0-150m</div>
                    <div className="rounded bg-[#00f3ff]/10 border border-[#00f3ff]/30 px-2 py-0.5 text-[#00f3ff]">
                        SENSORS: ACTIVE
                    </div>
                </div>
            </div>

            {/* Main Hero Chart Container */}
            <div className="w-full h-[380px] relative">
                
                {/* Subtle cyber background grid texture/overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.02)_0%,transparent_80%)]" />

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                        {/* High-visibility Tactical Grid */}
                        <CartesianGrid 
                            stroke="#1c2630" 
                            strokeDasharray="2 4" 
                            vertical={true}
                            horizontal={true}
                            opacity={0.65} 
                        />
                        
                        <XAxis 
                            dataKey="timestamp" 
                            hide={true} 
                        />
                        
                        {/* Displaying visual YAxis with tactical ticks */}
                        <YAxis 
                            domain={["auto", "auto"]}
                            stroke="#1c2630"
                            tickLine={true}
                            axisLine={true}
                            tick={{ fill: "rgba(0, 243, 255, 0.5)", fontSize: 8, fontFamily: "monospace" }}
                            width={35}
                        />
                        
                        <Tooltip
                            labelFormatter={() => ""}
                            formatter={(value) => [
                                `${Number(value).toFixed(1)} m`,
                                "Altitude",
                            ]}
                            contentStyle={{
                                backgroundColor: "#0b0f13",
                                border: "1px solid #00f3ff",
                                borderRadius: "4px",
                                fontFamily: "JetBrains Mono, monospace",
                                fontSize: "10px",
                                boxShadow: "0 0 10px rgba(0, 243, 255, 0.2)"
                            }}
                            itemStyle={{
                                color: "#00f3ff",
                            }}
                        />

                        {/* Glowing line plot */}
                        <Line
                            type="monotone"
                            dataKey="altitude"
                            stroke="#00f3ff"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ 
                                r: 6, 
                                stroke: "#00f3ff", 
                                strokeWidth: 2, 
                                fill: "#0b0f13",
                                shadow: "0 0 10px #00f3ff"
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            {/* HUD footer readout */}
            <div className="mt-4 flex items-center justify-end pt-3 border-t border-[#1c2630] text-[9px] text-zinc-500">
                <div>UNIT: <span className="text-[#00f3ff]">METRIC (M)</span></div>
            </div>
        </div>
    );
}