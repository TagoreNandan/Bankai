# BanKai — UAV Ground Control Station

A real-time telemetry dashboard for monitoring simulated UAV missions. Built with FastAPI and React over a pure WebSocket transport — no REST endpoints, no polling.

---

## What This Is

BanKai is a Ground Control Station that streams drone telemetry live and renders it without ever refreshing the page. It simulates a complete UAV mission lifecycle — from pre-flight checks through landing — and visualises altitude profile, battery consumption, signal strength, and aircraft attitude as the mission progresses.

The backend owns the mission state entirely. The simulation starts when the server starts and runs continuously regardless of whether a browser is connected. When you open the dashboard, you're tapping into a live stream at whatever point the mission currently is — if the drone is at 120m with 58% battery when you connect, that's what you see. This reflects how a real GCS operates: the telemetry source is independent of observer connections.

---

## Dashboard

The interface is organised around three layers:

**Mission Status** — a timeline of flight phases (PREFLIGHT → TAKEOFF → CLIMB → CRUISE → LOITER → RTB → LANDING) that updates as each phase transitions, alongside a live event log that records phase changes and triggered alerts with timestamps.

**KPI Cards** — five live scalar values: Altitude, Airspeed, Battery, RSSI, and current Mission Phase. These update at 2Hz as frames arrive over the WebSocket.

**Flight Analytics** — three charts that accumulate data across the session:
- Altitude Profile (Line Chart) — shows the climb, cruise, and descent arc
- Battery Consumption (Area Chart) — drains visibly over the mission; triggers alerts at 20% and 10%
- RSSI Signal Strength (Line Chart) — degrades as the drone moves away from home position, recovers on RTB

Below the charts: an Attitude Indicator (artificial horizon) showing live pitch and roll, and a Leaflet map plotting the drone's GPS track over the actual IIIT Hyderabad campus — where Skyeris operates.

---

## Architecture

```
React Frontend (TypeScript)
        │
        │  WebSocket  ws://localhost:8000/ws/telemetry
        │
FastAPI Backend (Python)
        │
DroneSimulator — stateful mission engine, runs from server startup
```

There are no HTTP endpoints for data. Every piece of telemetry — frames, phase changes, and alerts — arrives through a single WebSocket connection as typed JSON messages:

```
{ "type": "TELEMETRY",     "altitude": 118.4, "battery_pct": 72.1, ... }
{ "type": "PHASE_CHANGE",  "phase": "CRUISE" }
{ "type": "ALERT",         "code": "LOW_BATTERY", "value": 19.8 }
```

The frontend dispatches each message by `type` and updates only the relevant slice of state. Chart history is client-side — it accumulates from the moment the WebSocket connects and persists across mission cycles without resetting.

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React, TypeScript, Vite |
| State | Zustand (rolling 60-frame buffer per metric) |
| Charts | Recharts (Line, Area) |
| Map | React-Leaflet + OpenStreetMap |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | FastAPI, Python, asyncio |
| Transport | WebSockets (native, no socket.io) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Local Setup

**Prerequisites:** Python 3.10+, Node.js 18+, `bun`

### 1. Clone the repo

```bash
git clone https://github.com/TagoreNandan/Bankai.git
cd Bankai
```

### 2. Start the backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. The telemetry simulation starts immediately — no manual trigger required.

### 3. Start the frontend

Open a new terminal:

```bash
cd apps/web

bun install
bun run dev
```

Frontend runs at `http://localhost:5173`.

Open the browser and the dashboard connects automatically. That's it.

---

## Simulation Design

The simulator models realistic UAV physics rather than generating random noise. Each metric is phase-aware.

**Altitude** follows a smooth interpolation toward a phase target, with Gaussian noise applied per frame:

```
altitude += climb_rate × Δt + gauss(0, 1.5)
```

Cruise altitude is capped at 120m — the legal ceiling under DGCA drone regulations in India.

**Battery** drains at a phase-dependent rate. Motor load is highest during takeoff and climb, lowest during descent:

| Phase | Drain rate |
|---|---|
| TAKEOFF | 0.45% / sec |
| CLIMB | 0.38% / sec |
| CRUISE | 0.28% / sec |
| LOITER | 0.22% / sec |
| RTB / LANDING | 0.18–0.30% / sec |

Over a full mission cycle (~160 seconds), battery drops roughly 45–50%. Different battery capacities (1300 mAh, 2200 mAh, 3900 mAh) are selectable from the dashboard and scale the mission duration accordingly.

**RSSI** degrades with distance from the home position using a linear loss model:

```
rssi = max(40, 100 - distance_factor)
```

Signal recovers as the drone returns home during RTB, producing a visible arc on the chart.

**Pitch and Roll** vary by phase — gentle during cruise (±3°), aggressive banking during loiter (±20° roll) to simulate circular flight patterns.

---

## Telemetry Formulas

Every metric in the dashboard is computed from a deterministic formula, not arbitrary random values. Here's the exact math behind each one.

### Altitude

Altitude moves toward a phase-specific target at a defined climb rate, with small Gaussian noise added each tick to simulate real atmospheric turbulence and sensor jitter:

```
altitude(t+1) = altitude(t) + (climb_rate × Δt) + gauss(μ=0, σ=1.5)
```

During descent phases (RTB, LANDING), `climb_rate` is negative. Altitude is clamped to zero — the drone can't go underground:

```
altitude(t+1) = max(0, altitude(t+1))
```

Climb rates by phase:

| Phase | Climb Rate |
|---|---|
| TAKEOFF | +3.5 m/s |
| CLIMB | +4.0 m/s |
| CRUISE | 0 m/s (holds 120m) |
| LOITER | −0.5 m/s (slight drift) |
| RTB | −3.0 m/s |
| LANDING | −2.0 m/s |

---

### Battery

Battery drains continuously from the moment the simulation starts. The drain rate varies with motor load — heavier phases (takeoff, climb) consume more power than cruise or descent:

```
battery(t+1) = battery(t) − (drain_rate × Δt)
```

`drain_rate` is expressed as percentage per second and is phase-dependent (see Simulation Design table above). Battery is clamped at 0% and never goes negative.

The selected battery capacity (mAh) from the dashboard scales the drain rate inversely — a 1300 mAh pack drains faster than a 3900 mAh pack for the same motor load:

```
effective_drain = base_drain_rate × (reference_capacity / selected_capacity)
```

This means the charts will show a steeper slope with a smaller battery selected, which is the correct physical behaviour.

---

### RSSI (Signal Strength)

RSSI is modelled as a function of the drone's distance from the home position. As the UAV moves further away, signal degrades. As it returns, signal recovers. A floor of 40 prevents the value from going unrealistically low:

```
distance = haversine(current_lat, current_lon, home_lat, home_lon)

rssi = max(40, 100 − (distance × distance_loss_factor))
```

`distance_loss_factor` is tuned so that RSSI drops to ~60 at the mission's furthest point (approximately 400–500m from home), and recovers toward ~90 as the drone returns. Gaussian noise (σ=2) is added per frame to simulate radio interference:

```
rssi(t) = rssi(t) + gauss(μ=0, σ=2)
```

Alert thresholds trigger when RSSI falls below 50 (warning) or 30 (critical).

---

### Airspeed

Airspeed is set to a phase-specific target with small random variation applied each tick:

```
airspeed(t) = phase_target_speed + gauss(μ=0, σ=0.8)
```

Target speeds by phase:

| Phase | Target Speed |
|---|---|
| PREFLIGHT | 0 m/s |
| TAKEOFF | 5–8 m/s |
| CLIMB | 10–12 m/s |
| CRUISE | 16–20 m/s |
| LOITER | 6–8 m/s |
| RTB | 12–15 m/s |
| LANDING | 2–5 m/s |

---

### Pitch and Roll (Attitude)

Pitch and roll are simulated as bounded random walks within phase-specific limits. Each tick, the value shifts slightly from its previous position:

```
pitch(t+1) = pitch(t) + gauss(μ=0, σ=0.5)
pitch(t+1) = clamp(pitch(t+1), −pitch_limit, +pitch_limit)
```

The same formula applies to roll with its own limits. Phase-specific limits:

| Phase | Pitch Limit | Roll Limit |
|---|---|---|
| TAKEOFF | ±10° | ±5° |
| CRUISE | ±5° | ±8° |
| LOITER | ±3° | ±20° (banking in circles) |
| LANDING | ±5° | ±3° |

The exaggerated roll during LOITER (±20°) is intentional — it simulates the drone banking while flying a circular holding pattern, which is what makes the attitude indicator visibly active during that phase.

---

### GPS Position

The drone's lat/lon position is updated each tick based on current airspeed and a heading derived from the mission phase. Position is computed using a flat-earth approximation (valid for distances under ~10km):

```
Δlat = (airspeed × cos(heading) × Δt) / 111_139
Δlon = (airspeed × sin(heading) × Δt) / (111_139 × cos(lat))
```

The home position is set to IIIT Hyderabad campus (17.4450°N, 78.3489°E), which is where Skyeris Aero Tech is based. The drone departs from this point, flies a waypoint route, and returns during RTB — this is what the Leaflet map traces in real time.

---

## Design Decisions

**WebSocket over SSE or polling.** SSE is one-directional and polling introduces artificial latency. WebSocket is bidirectional — the same connection that receives telemetry could send commands back to the drone in a production system. The architecture is already correct for that extension.

**No REST endpoints.** All data flows through the typed WebSocket protocol. This keeps the communication model simple and mirrors how protocols like MAVLink operate in real UAV systems.

**Server-owned state.** The simulation runs from server startup, not from client connection. This means the mission progresses whether or not anyone is watching — the same way a real drone operates independently of ground observers.

**Zustand for the rolling buffer.** React state triggers full re-renders. Zustand lets each chart subscribe only to its own metric slice, so the altitude chart re-renders when altitude updates, not when RSSI does.

**Continuous looping missions.** When a mission cycle completes, the simulation restarts and the charts continue accumulating data rather than resetting. The graphs show repeated mission profiles over time — useful for spotting drift or degradation across cycles.

---

## What I'd Add With More Time

- **Historical playback** — replay a past mission from a stored frame log
- **Multi-drone support** — one WebSocket stream per drone, switchable from the dashboard
- **Real MAVLink integration** — swap the simulator for a live PX4 or ArduPilot feed without changing the frontend
- **Geofencing** — alert when the drone exits a defined polygon on the map
- **Persistent telemetry storage** — so reconnecting clients can replay frames they missed

---

## Author

**Tagore Nandan**  
Computer Science Engineering  
Hyderabad Institute of Technology and Management
