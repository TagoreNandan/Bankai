import KPICard from "../components/KPICard";

import { useTelemetry } from "../hooks/useTelemetry";

import { useTelemetryStore } from "../store/telemetryStore";

import AltitudeChart from "../components/AltitudeChart";
import BatteryChart from "../components/BatteryChart";
import RSSIChart from "../components/RSSIChart";

import PhaseTimeline from "../components/PhaseTimeline";
import MissionLog from "../components/MissionLog";

import UAVMap from "../components/UAVMap";

import AttitudeIndicator from "../components/AttitudeIndicator";

import AlertPanel from "../components/AlertPanel";

import BatterySelector from "../components/BatterySelector";


import { useEffect, useState } from "react";

export default function Home() {
  useTelemetry();

  const latest =
    useTelemetryStore((s) => s.latest);

  const connected =
    useTelemetryStore((s) => s.connected);


  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">
              BanKai
            </h1>

            <p className="text-zinc-400">
              Ground Control Station
            </p>
          </div>

          <div className="flex items-center gap-3">
            <BatterySelector />

            <div
              className="
                            flex items-center
                            gap-2
                            rounded-full
                            bg-green-500/20
                            px-4
                            py-2
                            text-green-400
                            "
            >
              <div
                className="
                                h-2
                                w-2
                                rounded-full
                                bg-green-400
                                animate-pulse
                                "
              />

              {connected
                ? "CONNECTED"
                : "DISCONNECTED"}
            </div>
          </div>
        </div>

        {/* Timeline + Log */}
        <div className="grid gap-4 lg:grid-cols-2">
          <PhaseTimeline />
          <MissionLog />
        </div>

        {/* Alerts */}
        <div className="mt-4">
          <AlertPanel />
        </div>

        {/* KPI Cards */}
        <div className="mt-4 grid gap-4 md:grid-cols-6">
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

        {/* Flight Analytics */}
        <div className="mt-8 rounded-xl border border-cyan-500/20 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Flight Analytics
          </h2>

          <div className="grid gap-4 lg:grid-cols-2">
            <AltitudeChart />
            <BatteryChart />
          </div>

          <div className="mt-4">
            <RSSIChart />
          </div>
        </div>

        {/* Attitude Indicator */}
        <div className="mt-8">
          <AttitudeIndicator />
        </div>

        {/* Mission Map */}
        <div className="mt-8">
          <UAVMap />
        </div>

      </div>
    </div>
  );
}