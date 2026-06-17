import KPICard from "../components/KPICard";

import { useTelemetry } from "../hooks/useTelemetry";

import { useTelemetryStore } from "../store/telemetryStore";

import AltitudeChart from "../components/AltitudeChart";
import BatteryChart from "../components/BatteryChart";

import PhaseTimeline from "../components/PhaseTimeline";
import MissionLog from "../components/MissionLog";

import UAVMap from "../components/UAVMap";

import AttitudeIndicator from "../components/AttitudeIndicator";

import AlertPanel from "../components/AlertPanel";

import BatterySelector from "../components/BatterySelector";


export default function Home() {
  useTelemetry();

  const latest =
    useTelemetryStore((s) => s.latest);

  const connected =
    useTelemetryStore((s) => s.connected);

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">
              SKYERIS GCS
            </h1>

            <p className="text-zinc-400">
              Ground Control Station
            </p>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-sm ${connected
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
              }`}
          >
            {connected ? "CONNECTED" : "DISCONNECTED"}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <PhaseTimeline />
          <MissionLog />
        </div>

        <div className="mt-4">
          <AlertPanel />
        </div>

        <div className="flex items-center gap-4">
          <BatterySelector />
          <div className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
            CONNECTED
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <KPICard
            title="Altitude"
            value={
              latest
                ? `${latest.altitude} m`
                : "--"
            }
          />

          <KPICard
            title="Airspeed"
            value={
              latest
                ? `${latest.airspeed} m/s`
                : "--"
            }
          />

          <KPICard
            title="Battery"
            value={
              latest
                ? `${latest.battery}%`
                : "--"
            }
          />

          <KPICard
            title="RSSI"
            value={
              latest
                ? `${latest.rssi}`
                : "--"
            }
          />

          <KPICard
            title="Phase"
            value={
              latest
                ? latest.phase
                : "--"
            }
          />
        </div>


        <div className="mt-8">
          <UAVMap />
        </div>

        <div className="mt-8">
          <AttitudeIndicator />
        </div>

        <div className="mt-8 rounded-xl border border-cyan-500/20 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Raw Telemetry
          </h2>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <AltitudeChart />
            <BatteryChart />
          </div>
        </div>
      </div>
    </div>
  );
}