import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { divIcon } from "leaflet";
import { useTelemetryStore } from "../store/telemetryStore";

import "leaflet/dist/leaflet.css";

// Pulsing cyan custom icon for the UAV marker
const uavIcon = divIcon({
    className: "custom-uav-icon",
    html: `
        <div class="relative flex h-5 w-5 items-center justify-center">
            <span class="absolute inline-flex h-full w-full rounded-full bg-[#00f3ff]/40 animate-uav-pulse"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f3ff] border border-white"></span>
        </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

export default function UAVMap() {
    const latest = useTelemetryStore((s) => s.latest);
    const frames = useTelemetryStore((s) => s.frames);

    if (!latest) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-[#1c2630] bg-[#10161d] font-mono text-zinc-500">
                Waiting for GPS connection...
            </div>
        );
    }

    const path: [number, number][] = frames.map((f) => [
        f.latitude,
        f.longitude,
    ]);

    return (
        <div className="relative overflow-hidden rounded-xl border border-[#1c2630] bg-[#10161d] p-4 text-xs font-mono transition-all duration-300 hover:border-[#00f3ff]/30">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold tracking-wider text-[#00f3ff] uppercase">
                    Live Trajectory
                </span>
            </div>

            <div className="h-[340px] w-full overflow-hidden rounded border border-[#1c2630] relative">
                <MapContainer
                    center={[latest.latitude, latest.longitude]}
                    zoom={16}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {path.length > 1 && (
                        <Polyline 
                            positions={path} 
                            color="#00f3ff" 
                            weight={3} 
                            opacity={0.8}
                            dashArray="1, 2"
                        />
                    )}

                    <Marker
                        position={[latest.latitude, latest.longitude]}
                        icon={uavIcon}
                    >
                        <Popup>
                            <div className="text-xs font-mono">
                                <span className="font-bold text-[#00f3ff]">UAV POS</span>
                                <br />
                                LAT: {latest.latitude.toFixed(6)}
                                <br />
                                LON: {latest.longitude.toFixed(6)}
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
                
                {/* HUD Overlay inside the map card */}
                <div className="absolute bottom-2 left-2 right-2 z-[1000] flex flex-wrap gap-x-4 gap-y-1 rounded bg-[#0b0f13]/90 border border-[#1c2630] px-3 py-1.5 text-[10px] text-zinc-400">
                    <div>
                        <span className="text-[#00f3ff] font-semibold">LAT:</span> {latest.latitude.toFixed(5)}° N
                    </div>
                    <div>
                        <span className="text-[#00f3ff] font-semibold">LONG:</span> {latest.longitude.toFixed(5)}° W
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00f3ff] animate-pulse"></span>
                        <span className="text-zinc-500 uppercase">GPS FIX</span>
                    </div>
                </div>
            </div>
        </div>
    );
}