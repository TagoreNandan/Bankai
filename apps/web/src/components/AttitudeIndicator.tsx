import { useTelemetryStore } from "../store/telemetryStore";

export default function AttitudeIndicator() {
    const latest = useTelemetryStore((s) => s.latest);

    const pitch = latest?.pitch ?? 0;
    const roll = latest?.roll ?? 0;

    return (
        <div className="rounded-xl border border-[#1c2630] bg-[#10161d] p-4 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <h3 className="mb-3 text-sm font-semibold tracking-wider text-[#00f3ff] uppercase">
                Attitude Indicator
            </h3>

            <div className="flex flex-col items-center py-2">
                <div className="relative h-40 w-40 overflow-hidden rounded-full border border-[#1c2630] shadow-inner shadow-black/80">
                    
                    {/* Horizon Disk (Translates/Rotates based on Pitch and Roll) */}
                    <div
                        className="absolute inset-0 transition-transform duration-150 ease-out"
                        style={{
                            transform: `translateY(${pitch * 1.5}px) rotate(${roll}deg)`,
                            transformOrigin: "center center",
                        }}
                    >
                        {/* Sky: Deep Space/Navy blue */}
                        <div className="h-1/2 bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex flex-col justify-end items-center text-[8px] text-[#00f3ff]/40 pb-2">
                            <div className="border-b border-[#00f3ff]/20 w-8 text-center pb-0.5">10</div>
                            <div className="border-b border-[#00f3ff]/20 w-12 text-center pb-0.5 mt-2">20</div>
                        </div>

                        {/* Horizon Line: bright white-cyan */}
                        <div className="h-[2px] bg-[#00f3ff] shadow-[0_0_4px_rgba(0,243,255,0.8)]" />

                        {/* Ground: Dark charcoal metallic */}
                        <div className="h-1/2 bg-gradient-to-b from-[#201d1a] to-[#12100e] flex flex-col items-center text-[8px] text-zinc-500/60 pt-2">
                            <div className="border-t border-zinc-600/40 w-8 text-center pt-0.5">-10</div>
                            <div className="border-t border-zinc-600/40 w-12 text-center pt-0.5 mt-2">-20</div>
                        </div>
                    </div>

                    {/* Fixed Aircraft Reference Symbol (HUD overlay) */}
                    <div className="absolute left-1/2 top-1/2 h-[2px] w-16 -translate-x-1/2 -translate-y-1/2 bg-[#ff007f] shadow-[0_0_4px_rgba(255,0,127,0.8)] z-10" />
                    <div className="absolute left-1/2 top-1/2 h-5 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-[#ff007f] shadow-[0_0_4px_rgba(255,0,127,0.8)] z-10" />
                    <div className="absolute left-[35%] top-[48%] h-3 w-[2px] bg-[#ff007f] shadow-[0_0_4px_rgba(255,0,127,0.8)] z-10" />
                    <div className="absolute right-[35%] top-[48%] h-3 w-[2px] bg-[#ff007f] shadow-[0_0_4px_rgba(255,0,127,0.8)] z-10" />

                    {/* HUD Dial Ring overlay */}
                    <div className="absolute inset-0 border-8 border-transparent rounded-full pointer-events-none z-20">
                        {/* Tick indicators at the bottom/top of the dial */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-[#00f3ff]" />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-center w-full max-w-[200px] border-t border-[#1c2630]/60 pt-2">
                    <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Pitch</span>
                        <span className={`text-xs font-bold ${pitch > 15 || pitch < -15 ? "text-[#ff007f]" : "text-[#00f3ff]"}`}>
                            {pitch.toFixed(1)}°
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Roll</span>
                        <span className={`text-xs font-bold ${roll > 30 || roll < -30 ? "text-[#ff007f]" : "text-[#00f3ff]"}`}>
                            {roll.toFixed(1)}°
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}