from app.simulator import DroneSimulator

sim = DroneSimulator()

for _ in range(10):
    frame = sim.tick()

    print(frame.model_dump_json(indent=2))