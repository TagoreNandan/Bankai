export type FlightPhase =
    | "PREFLIGHT"
    | "TAKEOFF"
    | "CLIMB"
    | "CRUISE"
    | "LOITER"
    | "RTB"
    | "LANDING"
    | "POSTFLIGHT";

export interface TelemetryFrame {
    type: "TELEMETRY";

    timestamp: number;

    phase: FlightPhase;

    altitude: number;
    airspeed: number;
    battery: number;

    rssi: number;

    pitch: number;
    roll: number;

    latitude: number;
    longitude: number;
}