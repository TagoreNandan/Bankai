from app.simulator import DroneSimulator

sim = DroneSimulator()

for i in range(60):
    sim.tick()

    print(
        sim.phase.value,
        round(sim.altitude, 1),
        round(sim.airspeed, 1),
        round(sim.battery, 1)
    )