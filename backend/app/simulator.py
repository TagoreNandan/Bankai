from app.schemas import FlightPhase


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

        print(
            f"Phase={self.phase}, elapsed={self.phase_elapsed}, "
            f"limit={self.phase_durations[self.phase]}"
        )

        if self.phase_elapsed >= self.phase_durations[self.phase]:
            print("ADVANCING PHASE")
            self.advance_phase()


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
            