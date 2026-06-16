from enum import Enum
from typing import Literal

from pydantic import BaseModel


class FlightPhase(str, Enum):
    PREFLIGHT = "PREFLIGHT"
    TAKEOFF = "TAKEOFF"
    CLIMB = "CLIMB"
    CRUISE = "CRUISE"
    LOITER = "LOITER"
    RTB = "RTB"
    LANDING = "LANDING"
    POSTFLIGHT = "POSTFLIGHT"


class AlertSeverity(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class TelemetryFrame(BaseModel):
    type: Literal["TELEMETRY"] = "TELEMETRY"

    timestamp: float

    phase: FlightPhase

    altitude: float
    airspeed: float
    battery: float

    rssi: float

    pitch: float
    roll: float

    latitude: float
    longitude: float


class AlertMessage(BaseModel):
    type: Literal["ALERT"] = "ALERT"

    severity: AlertSeverity

    message: str

    timestamp: float