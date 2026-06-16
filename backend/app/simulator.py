from app.schemas import FlightPhase
import random


class DroneSimulator:
    def __init__(self):
        self.phase = FlightPhase.PREFLIGHT

        self.altitude = 0.0
        self.airspeed = 0.0
        self.battery = 100.0

        self.rssi = 100.0

        self.pitch = 0.0
        self.roll = 0.0

        # IIIT Hyderabad
        self.latitude = 17.4450
        self.longitude = 78.3489

        self.phase_elapsed = 0

        self.phase_durations = {
            FlightPhase.PREFLIGHT: 10,
            FlightPhase.TAKEOFF: 8,
            FlightPhase.CLIMB: 20,
            FlightPhase.CRUISE: 40,
            FlightPhase.LOITER: 20,
            FlightPhase.RTB: 20,
            FlightPhase.LANDING: 15,
            FlightPhase.POSTFLIGHT: 10,
        }


    def tick(self):
        self.phase_elapsed += 1

        if self.phase_elapsed >= self.phase_durations[self.phase]:
            self.advance_phase()

        self.update_telemetry()



    def advance_phase(self):
        phases = [
            FlightPhase.PREFLIGHT,
            FlightPhase.TAKEOFF,
            FlightPhase.CLIMB,
            FlightPhase.CRUISE,
            FlightPhase.LOITER,
            FlightPhase.RTB,
            FlightPhase.LANDING,
            FlightPhase.POSTFLIGHT,
        ]

        current_index = phases.index(self.phase)

        if current_index < len(phases) - 1:
            self.phase = phases[current_index + 1]
            self.phase_elapsed = 0

    def update_telemetry(self):
        if self.phase == FlightPhase.PREFLIGHT:
            self.altitude = 0
            self.airspeed = 0

        elif self.phase == FlightPhase.TAKEOFF:
            self.altitude += 6
            self.airspeed = 8

        elif self.phase == FlightPhase.CLIMB:
            self.altitude += 10
            self.airspeed = 15
            
        elif self.phase == FlightPhase.CRUISE:
            self.altitude += random.uniform(-1, 1)
            self.airspeed = random.uniform(18, 22)

        elif self.phase == FlightPhase.LOITER:
            self.altitude += random.uniform(-2, 2)
            self.airspeed = random.uniform(8, 12)

        elif self.phase == FlightPhase.RTB:
            self.airspeed = 18

            self.latitude -= 0.00005
            self.longitude -= 0.00005

        elif self.phase == FlightPhase.LANDING:
            self.altitude = max(0, self.altitude - 12)
            self.airspeed = 5

        elif self.phase == FlightPhase.POSTFLIGHT:
            self.altitude = 0
            self.airspeed = 0

        self.battery = max(0, self.battery - 0.15)
        self.rssi = max(
            20,
            100 - (self.altitude * 0.15)
        )

        self.pitch = random.uniform(-10, 10)
        self.roll = random.uniform(-15, 15)