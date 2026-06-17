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
    const currentPhase =
        useTelemetryStore((s) => s.latest?.phase);

    const currentIndex =
        phases.indexOf(currentPhase ?? "");

    return (
        <div className="rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Mission Timeline
            </h3>

            <div className="flex flex-wrap gap-2">
                {phases.map((phase, index) => {
                    let classes =
                        "rounded px-3 py-2 font-medium";

                    // Completed phases
                    if (index < currentIndex) {
                        classes +=
                            " bg-green-500/20 text-green-400";
                    }

                    // Current phase
                    else if (index === currentIndex) {
                        classes +=
                            " bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/50";
                    }

                    // Future phases
                    else {
                        classes +=
                            " bg-cyan-500/10 text-cyan-400";
                    }

                    return (
                        <div
                            key={phase}
                            className={classes}
                        >
                            {index < currentIndex
                                ? `✓ ${phase}`
                                : index === currentIndex
                                    ? `▶ ${phase}`
                                    : phase}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}