import { useAlertStore } from "../store/alertStore";

export default function AlertPanel() {
    const alerts =
        useAlertStore((s) => s.alerts);

    return (
        <div className="rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Alerts
            </h3>

            {alerts.length === 0 ? (
                <div className="text-green-400">
                    System Nominal
                </div>
            ) : (
                <div className="space-y-2">
                    {alerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`rounded p-2 ${alert.level === "critical"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                        >
                            {alert.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}