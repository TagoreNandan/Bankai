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
    return (
        <div className="rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Mission Timeline
            </h3>

            <div className="flex flex-wrap gap-2">
                {phases.map((phase) => (
                    <div
                        key={phase}
                        className="rounded bg-cyan-500/10 px-3 py-2 text-cyan-400"
                    >
                        {phase}
                    </div>
                ))}
            </div>
        </div>
    );
}