import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from app.connection_manager import ConnectionManager
from app.simulator import DroneSimulator

app = FastAPI()

manager = ConnectionManager()

simulator = DroneSimulator()

battery_profiles = {
    "3000": 3000,
    "6000": 6000,
    "10000": 10000,
}


@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/config/battery/{capacity}")
def set_battery(capacity: int):

    simulator.battery_capacity = capacity
    simulator.remaining_capacity = capacity

    simulator.battery = 100

    return {
        "capacity": capacity
    }



@app.websocket("/ws/telemetry")
async def telemetry_stream(
    websocket: WebSocket
):
    await manager.connect(websocket)

    try:
        while True:
            frame = simulator.tick()

            await websocket.send_text(
                frame.model_dump_json()
            )

            await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        manager.disconnect(websocket)