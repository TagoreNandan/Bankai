import { useEffect, useRef } from "react";

import type { TelemetryFrame } from "../types/telemetry";

import { useTelemetryStore } from "../store/telemetryStore";
import { useMissionStore } from "../store/missionStore";
import { useAlertStore } from "../store/alertStore";
import type { Alert } from "../store/alertStore";

export function useTelemetry() {
    const addFrame =
        useTelemetryStore((s) => s.addFrame);

    const setConnected =
        useTelemetryStore((s) => s.setConnected);

    const addEvent =
        useMissionStore((s) => s.addEvent);

    const previousPhase =
        useRef<string | null>(null);

    const missionStarted =
        useRef(false);

    const setAlerts =
        useAlertStore((s) => s.setAlerts);

    useEffect(() => {
        console.log("Telemetry Hook Started");

        const ws = new WebSocket(
            "wss://bankai-oaoj.onrender.com/ws/telemetry"
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

            console.log(
                "PREVIOUS PHASE:",
                previousPhase.current
            );

            const frame: TelemetryFrame =
                JSON.parse(event.data);

            console.log(
                "FORCED MISSION START"
            );

            console.log(frame);

            console.log(
                "PREVIOUS PHASE:",
                previousPhase.current
            );

            if (!missionStarted.current) {
                missionStarted.current = true;

                const startTime =
                    Date.now();


                console.log(
                    "MISSION START SET:",
                    startTime
                );

                addEvent(
                    `Mission Started (${frame.phase})`
                );
            }
            else if (
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

            const alerts: Alert[] = [];

            if (frame.battery < 20) {
                alerts.push({
                    level: "warning",
                    message:
                        "Battery below 20%",
                });
            }

            if (frame.battery < 10) {
                alerts.push({
                    level: "critical",
                    message:
                        "Critical battery level",
                });
            }

            if (frame.rssi < 50) {
                alerts.push({
                    level: "warning",
                    message:
                        "Weak signal",
                });
            }

            if (frame.rssi < 30) {
                alerts.push({
                    level: "critical",
                    message:
                        "Signal almost lost",
                });
            }

            setAlerts(alerts);
        };

        return () => {
            ws.close();
        };
    }, []);
}