import { create } from "zustand";
import type { TelemetryFrame } from "../types/telemetry";

interface TelemetryState {
    latest: TelemetryFrame | null;
    frames: TelemetryFrame[];

    connected: boolean;

    setConnected: (connected: boolean) => void;

    addFrame: (frame: TelemetryFrame) => void;
}

export const useTelemetryStore =
    create<TelemetryState>((set) => ({
        latest: null,

        frames: [],

        connected: false,

        setConnected: (connected) =>
            set({ connected }),

        addFrame: (frame) =>
            set((state) => ({
                latest: frame,

                frames: [
                    ...state.frames.slice(-59),
                    frame,
                ],
            })),
    }));