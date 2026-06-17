# BanKai — UAV Ground Control Station

A real-time telemetry dashboard for monitoring simulated UAV missions, built with FastAPI and React using WebSockets as the primary telemetry transport. Telemetry updates stream in real time without polling.

Live Demo - https://bankai-web.vercel.app

---

BanKai is a Ground Control Station that streams drone telemetry live and renders it without ever refreshing the page. It simulates a complete UAV mission lifecycle — from pre-flight checks through landing — and visualises altitude profile, battery consumption, signal strength, and aircraft attitude as the mission progresses.

---

## Dashboard

The interface is organised around three layers:

**Mission Status** — a timeline of flight phases (PREFLIGHT → TAKEOFF → CLIMB → CRUISE → LOITER → RTB → LANDING) that updates as each phase transitions, alongside a live event log that records phase changes and triggered alerts with timestamps.

**KPI Cards** — five live scalar values: Altitude, Airspeed, Battery, RSSI, and current Mission Phase. These update at 2Hz as frames arrive over the WebSocket.

**Flight Analytics** — three charts that accumulate data across the session:
- Altitude Profile (Line Chart) — shows the climb, cruise, and descent arc
- Battery Consumption (Area Chart) — drains visibly over the mission; triggers alerts at 20% and 10%
- RSSI Signal Strength (Line Chart) — degrades as the drone moves away from home position, recovers on RTB

Below the charts: an Attitude Indicator (artificial horizon) showing live pitch and roll, and a Leaflet map plotting the drone's GPS track in real time.

---

## Architecture

```
React Frontend (TypeScript)
        │
        │  WebSocket  ws://localhost:8000/ws/telemetry
        │
FastAPI Backend (Python)
        │
DroneSimulator — stateful mission engine
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
| State | Zustand |
| Charts | Line, Area|
| Map | React-Leaflet + OpenStreetMap |
| Styling | Tailwind CSS + shadcn/u |
| Backend | FastAPI, Python, asyncio |
| Transport | WebSockets |
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

## How the Simulation Works

Every metric on the dashboard comes from a deterministic formula, not random noise dressed up to look like telemetry. The simulator ticks once every **0.5 seconds** (`Δt = 0.5s`) — that's why the KPI cards update at 2Hz. Each formula below uses that same tick interval.

Quick reference:

| Metric | Driven by | Behavior |
|---|---|---|
| Altitude | Climb rate per phase | Moves toward phase target |
| Battery | Drain rate per phase | Decreases monotonically |
| RSSI | Distance from home | Falls as drone moves away, recovers on return |
| Airspeed | Target speed per phase | Hovers around the phase's target with small jitter |
| Pitch / Roll | Phase-specific limits | Bounded random walk |
| GPS Position | Airspeed + heading | Traces the route on the map |

### Altitude

**What it does:** climbs or descends toward whatever altitude the current mission phase calls for, with a small amount of jitter added each tick so the line doesn't look perfectly straight (simulating turbulence and sensor noise).

```
altitude(t+1) = altitude(t) + (climb_rate × Δt) + noise
noise ~ Gaussian(mean = 0, std = 1.5)
altitude(t+1) = max(0, altitude(t+1))   ← never goes below ground
```

Climb rate depends on the phase:

| Phase | Climb Rate |
|---|---|
| TAKEOFF | +3.5 m/s |
| CLIMB | +4.0 m/s |
| CRUISE | 0 m/s (holds 120m — the standard VLOS altitude ceiling under DGCA's Drone Rules) |
| LOITER | −0.5 m/s (slight drift) |
| RTB | −3.0 m/s |
| LANDING | −2.0 m/s |

**Worked example:** drone is at 80m, just entered CLIMB.
`80 + (4.0 × 0.5) + ~0 = 82m` this tick → `84m` next tick → `86m` the tick after, and so on until it nears 120m and switches to CRUISE.

### Battery

**What it does:** drains continuously from mission start. The drain rate isn't constant — it's higher when the motors are working harder (takeoff, climb) and lower during cruise or descent.

```
battery(t+1) = battery(t) − (drain_rate × Δt)
battery(t+1) = max(0, battery(t+1))
```

Drain rate by phase:

| Phase | Drain Rate |
|---|---|
| TAKEOFF | 0.45% / sec |
| CLIMB | 0.38% / sec |
| CRUISE | 0.28% / sec |
| LOITER | 0.22% / sec |
| RTB | 0.30% / sec |
| LANDING | 0.18% / sec |

The battery capacity selected on the dashboard (1300 / 2000 / 2500 / 3000 mAh) scales the effective drain rate — a smaller pack drains faster for the same motor load, which is the physically correct behavior and is what makes the battery chart's slope steeper or shallower depending on which pack you pick.

**Worked example:** drone at 70% battery, in CRUISE, one tick (0.5s) later:
`70 − (0.28 × 0.5) = 69.86%`

Over a full ~160-second mission, that adds up to roughly a 45–50% drop — consistent with what the Battery Consumption chart shows by the time the mission reaches RTB.

### RSSI (Signal Strength)

**What it does:** signal strength is tied to how far the drone is from its home position, not to anything random. The farther out, the weaker the signal; it recovers as the drone heads home during RTB.

```
distance = haversine(current_lat, current_lon, home_lat, home_lon)
rssi(t) = max(40, 100 − (distance × distance_loss_factor)) + noise
noise ~ Gaussian(mean = 0, std = 2)
```

`distance_loss_factor` is tuned so RSSI bottoms out around 60 at the mission's furthest point (roughly 400–500m from home) and climbs back toward ~90 as the drone returns — that arc is what produces the dip-and-recover shape on the RSSI chart.

**Worked example:** at 300m from home, signal loss is roughly `300 × 0.089 ≈ 27`, so `rssi ≈ 100 − 27 = 73` (plus a small noise wobble). Alerts fire when RSSI drops below 50 (warning) or 30 (critical).

### Airspeed

**What it does:** settles around a target speed for the current phase, with small tick-to-tick variation so it doesn't look perfectly flat.

```
airspeed(t) = phase_target_speed + noise
noise ~ Gaussian(mean = 0, std = 0.8)
```

| Phase | Target Speed |
|---|---|
| PREFLIGHT | 0 m/s |
| TAKEOFF | 5–8 m/s |
| CLIMB | 10–12 m/s |
| CRUISE | 16–20 m/s |
| LOITER | 6–8 m/s |
| RTB | 12–15 m/s |
| LANDING | 2–5 m/s |

**Worked example:** in CRUISE with a target of 18 m/s, consecutive readings might come in as 17.6, 18.3, 17.9 — close to 18 but never perfectly flat, which is what real airspeed sensors look like.

### Pitch and Roll (Attitude)

**What it does:** rather than snapping between fixed values, pitch and roll drift gradually — each tick nudges slightly from the previous value, bounded within limits that depend on the phase.

```
pitch(t+1)  = clamp(pitch(t) + noise, −pitch_limit, +pitch_limit)
roll(t+1)   = clamp(roll(t)  + noise, −roll_limit,  +roll_limit)
noise ~ Gaussian(mean = 0, std = 0.5)
```

| Phase | Pitch Limit | Roll Limit |
|---|---|---|
| TAKEOFF | ±10° | ±5° |
| CRUISE | ±5° | ±8° |
| LOITER | ±3° | ±20° (banking in circles) |
| LANDING | ±5° | ±3° |

The wide roll range during LOITER (±20°) is deliberate — it simulates the drone banking through a circular holding pattern, which is what makes the attitude indicator visibly animated during that phase instead of sitting still.

### GPS Position

**What it does:** updates the drone's lat/lon each tick based on current airspeed and the heading for that leg of the route, using a flat-earth approximation (accurate enough for distances under ~10km).

```
Δlat = (airspeed × cos(heading) × Δt) / 111139
Δlon = (airspeed × sin(heading) × Δt) / (111139 × cos(lat))
```

The home coordinate is a fixed point set in the simulator's config, and the mission flies a closed waypoint loop — departing from home, out to the furthest waypoint, then back during RTB. That loop is exactly what the Leaflet map traces in real time.

---

## Design Decisions

**WebSocket over SSE or polling-** SSE is one-directional and polling introduces artificial latency. WebSocket is bidirectional — the same connection that receives telemetry could send commands back to the drone in a production system.

**No REST endpoints-** All data flows through the typed WebSocket protocol. This keeps the communication model simple and mirrors how protocols like MAVLink operate in real UAV systems.

**Server-owned stat-** The simulation runs from server startup, not from client connection. This means the mission progresses whether or not anyone is watching — the same way a real drone operates independently of ground observers.

**Zustand for the rolling buffe-** React state triggers full re-renders. Zustand lets each chart subscribe only to its own metric slice, so the altitude chart re-renders when altitude updates, not when RSSI does.

**Continuous looping missions-** When a mission cycle completes, the simulation restarts and the charts continue accumulating data rather than resetting. The graphs show repeated mission profiles over time — useful for spotting drift or degradation across cycles.

---

## What I'd Add With More Time

- **IoT support** - I would like to extend support for iot devices like arduino, building a real time dashboard for metrics.
- **Historical playback** — replay a past mission from a stored frame log
- **Multi-drone support** — one WebSocket stream per drone, switchable from the dashboard
- **Geofencing** — alert when the drone exits a defined polygon on the map

---

## Author

**Tagore Nandan**
**Computer Science Engineering**
**Hyderabad Institute of Technology and Management**
