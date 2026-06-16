import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

import { useTelemetryStore } from "../store/telemetryStore";

import "leaflet/dist/leaflet.css";

export default function UAVMap() {
    const latest =
        useTelemetryStore((s) => s.latest);

    const frames =
        useTelemetryStore((s) => s.frames);

    if (!latest) {
        return (
            <div className="rounded-xl border border-cyan-500/20 p-4">
                Waiting for GPS...
            </div>
        );
    }

    const path: [number, number][] =
        frames.map((f) => [
            f.latitude,
            f.longitude,
        ]);

    return (
        <div className="rounded-xl border border-cyan-500/20 p-4">
            <h3 className="mb-4 text-lg font-semibold">
                Live UAV Position
            </h3>

            <MapContainer
                center={[
                    latest.latitude,
                    latest.longitude,
                ]}
                zoom={16}
                style={{
                    height: "400px",
                    width: "100%",
                }}
            >
                <TileLayer
                    attribution="© OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Polyline positions={path} />

                <Marker
                    position={[
                        latest.latitude,
                        latest.longitude,
                    ]}
                >
                    <Popup>
                        UAV Position
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}