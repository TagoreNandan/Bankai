from app.schemas import FlightPhase
import random
import time

from app.schemas import (
    TelemetryFrame,
    FlightPhase,
)


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

        self.battery_capacity = 1300
        self.remaining_capacity = 1300
        self.current_draw = {
            FlightPhase.PREFLIGHT: 2000,
            FlightPhase.TAKEOFF: 25000,
            FlightPhase.CLIMB: 20000,
            FlightPhase.CRUISE: 15000,
            FlightPhase.LOITER: 12000,
            FlightPhase.RTB: 18000,
            FlightPhase.LANDING: 10000,
            FlightPhase.POSTFLIGHT: 1000,
        }

        self.home_lat = 17.4450
        self.home_lon = 78.3489

        self.phase_elapsed = 0

        self.phase_durations = {
            FlightPhase.PREFLIGHT: 5,
            FlightPhase.TAKEOFF: 8,
            FlightPhase.CLIMB: 20,
            FlightPhase.CRUISE: 90,
            FlightPhase.LOITER: 45,
            FlightPhase.RTB: 45,
            FlightPhase.LANDING: 10,
            FlightPhase.POSTFLIGHT: 5,
        }

        self.waypoints = [
            (17.4450, 78.3489),
            (17.4465, 78.3505),
            (17.4480, 78.3490),
            (17.4475, 78.3465),
            (17.4450, 78.3489),
        ]

        self.current_wp = 0


    def tick(self):
        self.phase_elapsed += 1

        if self.phase_elapsed >= self.phase_durations[self.phase]:
            self.advance_phase()

        self.update_telemetry()

        return TelemetryFrame(
            timestamp=time.time(),
            phase=self.phase,
            altitude=round(self.altitude, 2),
            airspeed=round(self.airspeed, 2),
            battery=round(self.battery, 2),
            rssi=round(self.rssi, 2),
            pitch=round(self.pitch, 2),
            roll=round(self.roll, 2),
            latitude=round(self.latitude, 6),
            longitude=round(self.longitude, 6),
        )



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

        else:
            self.reset()

    def update_telemetry(self):
        if self.phase == FlightPhase.PREFLIGHT:
            self.altitude = 0
            self.airspeed = 0
            self.pitch = 0
            self.roll = 0
        

        elif self.phase == FlightPhase.TAKEOFF:
            self.altitude = min(
                30,
                self.altitude + 3.5
            )

            self.airspeed = 8
            self.pitch = random.uniform(5, 10)
            self.roll = random.uniform(-5, 5)

        elif self.phase == FlightPhase.CLIMB:
            self.altitude = min(
                120,
                self.altitude + 4
            )
            self.airspeed = 15

            self.pitch = random.uniform(8, 15)
            self.roll = random.uniform(-4, 4)
            
        elif self.phase == FlightPhase.CRUISE:
            self.altitude = 120 + random.uniform(-3, 3)
            self.airspeed = random.uniform(18, 22)

            target_lat, target_lon = \
                self.waypoints[self.current_wp]

            self.latitude += (
                target_lat - self.latitude
            ) * 0.03

            self.longitude += (
                target_lon - self.longitude
            ) * 0.03

            if (
                abs(self.latitude - target_lat)
                < 0.0001
                and
                abs(self.longitude - target_lon)
                < 0.0001
            ):
                self.current_wp = (
                    self.current_wp + 1
                ) % len(self.waypoints)

        elif self.phase == FlightPhase.LOITER:
            self.altitude = 100 + random.uniform(-5, 5)
            self.airspeed = random.uniform(
                8,12
            )
            self.pitch = random.uniform(
                -3,3
            )
            self.roll = random.uniform(
                -20,20
            )

        elif self.phase == FlightPhase.RTB:
            self.altitude = max(
                30,
                self.altitude - 3
            )

            self.airspeed = 18
            self.latitude -= 0.00005
            self.longitude -= 0.00005

            self.pitch = random.uniform(
                -4,4
            )

            self.roll = random.uniform(
                -8,8
            )

        elif self.phase == FlightPhase.LANDING:
            self.altitude = max(
                0,
                self.altitude - 2
            )
            self.airspeed = 5

            self.pitch = random.uniform(
                -6,
                -2
            )
            self.roll = random.uniform(
                -3,3
            )

        elif self.phase == FlightPhase.POSTFLIGHT:
            self.altitude = 0
            self.airspeed = 0

            if self.phase_elapsed > 20:
                self.reset()

        current = self.current_draw[self.phase]
        self.remaining_capacity -= (
            current / 3600
        )

        self.battery = (
            self.remaining_capacity
            / self.battery_capacity
        ) * 100

        distance = (
                (
                self.latitude -
                self.home_lat
            ) ** 2
            +
            (
                self.longitude -
                self.home_lon
            ) ** 2
        ) ** 0.5 * 111000

        self.rssi = max(
            15,
            100 - distance / 3
        )


        print(self.remaining_capacity)
        print(self.battery)
    
    def reset(self):
        self.phase = FlightPhase.PREFLIGHT

        self.altitude = 0.0
        self.airspeed = 0.0
        self.battery = 100.0

        self.rssi = 100.0

        self.pitch = 0.0
        self.roll = 0.0

        self.latitude = 17.4450
        self.longitude = 78.3489

        self.phase_elapsed = 0

        self.remaining_capacity = self.battery_capacity

        self.current_wp = 0