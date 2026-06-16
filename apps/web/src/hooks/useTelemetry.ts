import { useEffect } from "react";

import type { TelemetryFrame } from "../types/telemetry";

import { useTelemetryStore } from "../store/telemetryStore";

export function useTelemetry() {
    const addFrame =
        useTelemetryStore((s) => s.addFrame);

    const setConnected =
        useTelemetryStore((s) => s.setConnected);

    useEffect(() => {
        const ws = new WebSocket(
            "ws://localhost:8000/ws/telemetry"
        );

        ws.onopen = () => {
            setConnected(true);
        };

        ws.onclose = () => {
            setConnected(false);
        };

        ws.onmessage = (event) => {
            const frame: TelemetryFrame =
                JSON.parse(event.data);

            addFrame(frame);
        };

        return () => ws.close();
    }, []);
}