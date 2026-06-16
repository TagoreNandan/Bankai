import { useTelemetryStore } from "../store/telemetryStore";

export default function AttitudeIndicator() {
    const latest = useTelemetryStore((s) => s.latest);

    const pitch = latest?.pitch ?? 0;
    const roll = latest?.roll ?? 0;

    return (
        <div className="rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Attitude Indicator
            </h3>

            <div className="flex flex-col items-center">
                <div
                    className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-cyan-500"
                >
                    <div
                        className="absolute inset-[-50%]"
                        style={{
                            transform: `translateY(${pitch * 2}px) rotate(${roll}deg)`,
                        }}
                    >
                        {/* Sky */}
                        <div className="h-1/2 bg-sky-500" />

                        {/* Horizon */}
                        <div className="h-1 bg-white" />

                        {/* Ground */}
                        <div className="h-1/2 bg-amber-700" />
                    </div>

                    {/* Aircraft Symbol */}
                    <div className="absolute left-1/2 top-1/2 h-1 w-20 -translate-x-1/2 bg-cyan-400" />
                    <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 bg-cyan-400" />
                </div>

                <div className="mt-4 text-center">
                    <div>Pitch: {pitch.toFixed(1)}°</div>
                    <div>Roll: {roll.toFixed(1)}°</div>
                </div>
            </div>
        </div>
    );
}