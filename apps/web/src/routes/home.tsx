import { useTelemetry } from "../hooks/useTelemetry";
import { useTelemetryStore } from "../store/telemetryStore";

import AltitudeChart from "../components/AltitudeChart";
import BatteryChart from "../components/BatteryChart";
import RSSIChart from "../components/RSSIChart";
import MissionLog from "../components/MissionLog";
import UAVMap from "../components/UAVMap";
import AttitudeIndicator from "../components/AttitudeIndicator";
import AlertPanel from "../components/AlertPanel";
import BatterySelector from "../components/BatterySelector";
import PhaseTimeline from "../components/PhaseTimeline";
import KPICard from "../components/KPICard";

export default function Home() {
    useTelemetry();

    const latest = useTelemetryStore((s) => s.latest);
    const connected = useTelemetryStore((s) => s.connected);

    // Format metrics for KPI cards
    const altitudeVal = latest ? `${latest.altitude.toLocaleString()} m` : "--";
    const airspeedVal = latest ? `${latest.airspeed.toFixed(1)} m/s` : "--";
    const batteryVal = latest ? `${latest.battery}%` : "--";
    const rssiVal = latest ? `${latest.rssi} dBm` : "--";
    const phaseVal = latest ? latest.phase : "--";

    return (
        <div className="min-h-screen w-full bg-[#0b0f13] text-zinc-100 font-mono select-none px-6 py-4 overflow-x-hidden flex justify-center">
            <div className="w-full max-w-[1400px] flex flex-col gap-4">
                
                {/* TOP BAR */}
                <header className="flex items-center justify-between border-b border-[#1c2630] pb-2.5">
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-widest text-[#00f3ff] font-sans">
                            BanKai
                        </span>
                        <span className="text-[9px] tracking-widest text-zinc-500 uppercase -mt-0.5">
                            Ground Control Station
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <BatterySelector />

                        {/* Connection status pill */}
                        <div className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-bold border ${
                            connected 
                                ? "bg-[#00f3ff]/5 border-[#00f3ff]/30 text-[#00f3ff]" 
                                : "bg-[#ff007f]/5 border-[#ff007f]/30 text-[#ff007f]"
                        }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                                connected ? "bg-[#00f3ff] animate-pulse" : "bg-[#ff007f]"
                            }`} />
                            <span className="uppercase tracking-wider">
                                {connected ? "CONNECTED" : "DISCONNECTED"}
                            </span>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT ROWS */}
                <main className="flex flex-col gap-4">
                    
                    {/* ROW 1: Mission Timeline & Event Log */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <PhaseTimeline />
                        <MissionLog />
                    </section>

                    {/* ROW 2: Alerts Panel */}
                    <section className="w-full">
                        <AlertPanel />
                    </section>

                    {/* ROW 3: KPI Cards */}
                    <section className="grid grid-cols-2 md:grid-cols-[1.1fr_1.1fr_1.1fr_1.1fr_0.8fr] gap-3">
                        <KPICard title="Altitude" value={altitudeVal} />
                        <KPICard title="Airspeed" value={airspeedVal} />
                        <KPICard title="Battery" value={batteryVal} />
                        <KPICard title="RSSI" value={rssiVal} />
                        <KPICard title="Phase" value={phaseVal} />
                    </section>

                    {/* ROW 4: Large Altitude Profile Chart */}
                    <section className="w-full">
                        <AltitudeChart />
                    </section>

                    {/* ROW 5: Battery Chart & RSSI Chart */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <BatteryChart />
                        <RSSIChart />
                    </section>

                    {/* ROW 6: UAV Map & Artificial Horizon */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <UAVMap />
                        </div>
                        <div>
                            <AttitudeIndicator />
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}