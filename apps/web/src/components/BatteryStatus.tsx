import { useTelemetryStore } from "../store/telemetryStore";

export default function BatteryStatus() {
    const latest = useTelemetryStore((s) => s.latest);

    if (!latest) {
        return (
            <div className="rounded-xl border border-[#1c2630] bg-[#10161d] p-4 text-xs font-mono text-zinc-500">
                Waiting for telemetry...
            </div>
        );
    }

    const battery = latest.battery;
    const isLow = battery < 20;

    // Calculate voltage (6S pack simulation: 21.0V to 25.2V)
    const voltage = (21.0 + (battery * 0.042)).toFixed(1);
    
    // Calculate temperature (ranges between 30C and 45C depending on battery use)
    const temp = (30 + (100 - battery) * 0.15 + (Math.sin(latest.timestamp) * 0.5)).toFixed(1);

    // Calculate flight time remaining
    const totalSecs = Math.round(battery * 108); // up to 3 hours (10800 secs)
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const estTime = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    // SVG radial variables
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (battery / 100) * circumference;

    return (
        <div className="rounded-xl border border-[#1c2630] bg-[#10161d] p-4 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold tracking-wider text-[#00f3ff] uppercase">
                    Battery Status
                </span>
                <span className={`text-sm font-bold ${isLow ? "text-[#ff007f] animate-pulse" : "text-[#00f3ff]"}`}>
                    {battery}%
                </span>
            </div>

            <div className="flex items-center gap-6 py-2">
                {/* Radial progress circle */}
                <div className="relative flex items-center justify-center shrink-0">
                    <svg className="h-20 w-20 transform -rotate-90">
                        {/* Background track */}
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            className="stroke-[#1c2630]"
                            strokeWidth="6"
                            fill="transparent"
                        />
                        {/* Foreground fill */}
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            className={`transition-all duration-500 ease-out ${
                                isLow ? "stroke-[#ff007f]" : "stroke-[#00f3ff]"
                            }`}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    
                    {/* Centered label */}
                    <div className="absolute text-[8px] font-bold tracking-tighter uppercase text-center">
                        <span className={isLow ? "text-[#ff007f] animate-pulse" : "text-[#00f3ff]"}>
                            {isLow ? "CRIT" : "NOMINAL"}
                        </span>
                    </div>
                </div>

                {/* Battery spec list */}
                <div className="flex-1 space-y-1.5 border-l border-[#1c2630]/60 pl-6 py-1">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500 uppercase">Voltage</span>
                        <span className="text-zinc-300 font-bold">{voltage}V</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500 uppercase">Temp</span>
                        <span className="text-zinc-300 font-bold">{temp}°C</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500 uppercase">Est. Time</span>
                        <span className="text-[#00f3ff] font-bold">{estTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
