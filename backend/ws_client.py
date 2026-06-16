# ws_client.py

import asyncio
import websockets


async def main():
    async with websockets.connect(
        "ws://localhost:8000/ws/telemetry"
    ) as ws:

        for _ in range(10):
            msg = await ws.recv()
            print(msg)


asyncio.run(main())