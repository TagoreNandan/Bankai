import { useMissionStore } from "../store/missionStore";

export default function MissionLog() {
    const events =
        useMissionStore((s) => s.events);

    return (
        <div className="rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Mission Event Log
            </h3>

            <div className="mb-2 text-cyan-400">
                Events: {events.length}
            </div>

            <div className="space-y-2 text-sm">
                {events.map((event, index) => (
                    <div key={index}>
                        <span className="text-cyan-400">
                            [{event.timestamp}]
                        </span>{" "}
                        {event.message}
                    </div>
                ))}
            </div>
        </div>
    );
}