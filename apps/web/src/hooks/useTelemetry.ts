import { useEffect, useRef } from "react";

import type { TelemetryFrame } from "../types/telemetry";

import { useTelemetryStore } from "../store/telemetryStore";
import { useMissionStore } from "../store/missionStore";

export function useTelemetry() {
    const addFrame =
        useTelemetryStore((s) => s.addFrame);

    const setConnected =
        useTelemetryStore((s) => s.setConnected);

    const addEvent =
        useMissionStore((s) => s.addEvent);

    const previousPhase =
        useRef<string | null>(null);

    useEffect(() => {
        console.log("Telemetry Hook Started");

        const ws = new WebSocket(
            "ws://localhost:8000/ws/telemetry"
        );

        ws.onopen = () => {
            console.log("WebSocket Connected");

            setConnected(true);

            addEvent(
                "Telemetry Link Established"
            );
        };

        ws.onclose = () => {
            console.log("WebSocket Closed");

            setConnected(false);

            addEvent(
                "Telemetry Link Lost"
            );
        };

        ws.onerror = (error) => {
            console.error(
                "WebSocket Error:",
                error
            );
        };

        ws.onmessage = (event) => {
            console.log(
                "MESSAGE RECEIVED"
            );

            const frame: TelemetryFrame =
                JSON.parse(event.data);

            console.log(frame);

            if (
                previousPhase.current === null
            ) {
                addEvent(
                    `Mission Started (${frame.phase})`
                );
            } else if (
                previousPhase.current !==
                frame.phase
            ) {
                addEvent(
                    `${previousPhase.current} → ${frame.phase}`
                );
            }

            previousPhase.current =
                frame.phase;

            addFrame(frame);
        };

        return () => {
            ws.close();
        };
    }, []);
}