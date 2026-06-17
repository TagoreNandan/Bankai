import { useMissionStore } from "../store/missionStore";

export default function MissionLog() {
    const events = useMissionStore((s) => s.events);

    // Limit list to last 300 elements and reverse to put latest events on top
    const displayEvents = [...events].slice(-300).reverse();

    const formatMessage = (msg: string) => {
        const msgUpper = msg.toUpperCase();
        
        // Highlight WARN or critical issues in pink/red
        if (msgUpper.includes("WARN") || msgUpper.includes("LOST") || msgUpper.includes("ERROR") || msgUpper.includes("FAIL")) {
            return <span className="text-[#ff007f]">{msg}</span>;
        }
        
        // Highlight phase changes or establishments in cyan
        if (msgUpper.includes("→") || msgUpper.includes("ESTABLISHED") || msgUpper.includes("SUCCESS") || msgUpper.includes("PHASE")) {
            return <span className="text-[#00f3ff]">{msg}</span>;
        }

        // Highlight command-like text in pale blue
        if (msgUpper.includes("CMD") || msgUpper.includes("INIT") || msgUpper.includes("READY")) {
            return <span className="text-cyan-300/80">{msg}</span>;
        }

        return <span className="text-zinc-300">{msg}</span>;
    };

    return (
        <div className="flex h-[160px] flex-col rounded-xl border border-[#1c2630] bg-[#10161d] p-4 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <div className="flex items-center justify-between mb-2 shrink-0 border-b border-[#1c2630]/60 pb-2">
                <span className="text-sm font-semibold tracking-wider text-[#00f3ff] uppercase">
                    Mission Event Log
                </span>
                <span className="text-[10px] text-zinc-500 uppercase">
                    Total: {events.length}
                </span>
            </div>

            {/* Scrollable event list */}
            <div className="flex-1 overflow-y-auto scroll-smooth pr-1 space-y-1.5 custom-scrollbar">
                {displayEvents.length === 0 ? (
                    <div className="text-zinc-600 italic">No mission events logged.</div>
                ) : (
                    displayEvents.map((event, index) => (
                        <div key={index} className="leading-relaxed border-b border-[#1c2630]/20 pb-1 last:border-b-0">
                            <span className="text-zinc-500 mr-1.5">
                                [{event.timestamp}]
                            </span>
                            {formatMessage(event.message)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}