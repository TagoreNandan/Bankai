import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from app.connection_manager import ConnectionManager
from app.simulator import DroneSimulator

app = FastAPI()

manager = ConnectionManager()

simulator = DroneSimulator()


@app.get("/health")
async def health():
    return {"status": "ok"}



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