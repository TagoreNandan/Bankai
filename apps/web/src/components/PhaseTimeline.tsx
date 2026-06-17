import { useTelemetryStore } from "../store/telemetryStore";

const phases = [
    "PREFLIGHT",
    "TAKEOFF",
    "CLIMB",
    "CRUISE",
    "LOITER",
    "RTB",
    "LANDING",
    "POSTFLIGHT",
];

export default function PhaseTimeline() {
    const currentPhase = useTelemetryStore((s) => s.latest?.phase);
    const currentIndex = phases.indexOf(currentPhase ?? "");

    return (
        <div className="flex h-[160px] flex-col rounded-xl border border-[#1c2630] bg-[#10161d] p-4 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <h3 className="mb-2 text-sm font-semibold tracking-wider text-[#00f3ff] uppercase border-b border-[#1c2630]/60 pb-2 shrink-0">
                Mission Timeline
            </h3>

            <div className="flex flex-wrap gap-2 overflow-y-auto flex-1 py-1 custom-scrollbar">
                {phases.map((phase, index) => {
                    const isCurrent = index === currentIndex;
                    const isCompleted = index < currentIndex;

                    let classes = "rounded px-2.5 py-1.5 text-[10px] font-semibold transition-all ";
                    
                    if (isCompleted) {
                        classes += "bg-[#00f3ff]/5 border border-[#00f3ff]/20 text-[#00f3ff]/60";
                    } else if (isCurrent) {
                        classes += "bg-[#00f3ff] text-black font-extrabold shadow-[0_0_10px_rgba(0,243,255,0.4)]";
                    } else {
                        classes += "bg-[#1c2630]/40 border border-[#1c2630]/80 text-zinc-500";
                    }

                    return (
                        <div key={phase} className={classes}>
                            {isCompleted ? `✓ ${phase}` : isCurrent ? `▶ ${phase}` : phase}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}