from app.simulator import DroneSimulator

sim = DroneSimulator()

for i in range(50):
    sim.tick()
    print(
        f"Tick={i} "
        f"Phase={sim.phase.value} "
        f"Elapsed={sim.phase_elapsed}"
    )