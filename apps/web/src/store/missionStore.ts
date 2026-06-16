import { create } from "zustand";

export interface MissionEvent {
    timestamp: string;
    message: string;
}

interface MissionState {
    events: MissionEvent[];

    addEvent: (message: string) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
    events: [],

    addEvent: (message) =>
        set((state) => ({
            events: [
                {
                    timestamp: new Date().toLocaleTimeString(),
                    message,
                },
                ...state.events.slice(0, 24),
            ],
        })),
}));