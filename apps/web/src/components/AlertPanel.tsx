import { useAlertStore } from "../store/alertStore";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AlertPanel() {
    const alerts = useAlertStore((s) => s.alerts);

    return (
        <div className="rounded-xl border border-[#1c2630] bg-[#10161d] p-4 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <div className="flex items-center justify-between mb-3 border-b border-[#1c2630]/60 pb-2">
                <span className="text-sm font-semibold tracking-wider text-[#00f3ff] uppercase">
                    System Alerts & Diagnostics
                </span>
                <span className="text-[10px] text-zinc-500 uppercase">
                    Alert Count: {alerts.length}
                </span>
            </div>

            {alerts.length === 0 ? (
                <div className="flex items-center gap-2 rounded border border-[#00f3ff]/20 bg-[#00f3ff]/5 p-3 text-[#00f3ff]">
                    <CheckCircle2 size={16} className="text-[#00f3ff]" />
                    <div className="flex-1">
                        <span className="font-bold">STATUS: NOMINAL</span> — All sensor feeds and telemetry diagnostics reporting normal operating values.
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {alerts.map((alert, index) => {
                        const isCritical = alert.level === "critical";
                        return (
                            <div
                                key={index}
                                className={`flex items-start gap-2.5 rounded border p-3 ${
                                    isCritical
                                        ? "border-[#ff007f]/45 bg-[#ff007f]/5 text-[#ff007f]"
                                        : "border-[#eab308]/45 bg-[#eab308]/5 text-[#eab308]"
                                }`}
                            >
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <span className="font-bold uppercase mr-1">
                                        {alert.level}:
                                    </span>
                                    {alert.message}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}