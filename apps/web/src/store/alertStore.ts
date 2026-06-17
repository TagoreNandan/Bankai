import { create } from "zustand";

export interface Alert {
    level: "warning" | "critical";
    message: string;
}

interface AlertState {
    alerts: Alert[];
    setAlerts: (alerts: Alert[]) => void;
}

export const useAlertStore =
    create<AlertState>((set) => ({
        alerts: [],
        setAlerts: (alerts) =>
            set({ alerts }),
    }));