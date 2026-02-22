from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class MuscleGroup(str, Enum):
    CHEST = "chest"
    BACK = "back"
    SHOULDERS = "shoulders"
    BICEPS = "biceps"
    TRICEPS = "triceps"
    QUADS = "quads"
    HAMSTRINGS = "hamstrings"
    GLUTES = "glutes"
    CALVES = "calves"
    CORE = "core"
    FOREARMS = "forearms"
    TRAPS = "traps"


class SetScheme(BaseModel):
    sets: int = Field(..., ge=1, le=20)
    reps: str = Field(..., description="e.g. '8-12' or '5' or 'AMRAP'")
    rest_seconds: int = Field(..., ge=0)
    rpe: Optional[float] = Field(None, ge=1, le=10)
    tempo: Optional[str] = Field(None, description="e.g. '3-1-1-0' eccentric-pause-concentric-top")


class Citation(BaseModel):
    title: str
    authors: list[str]
    year: int
    journal: Optional[str] = None
    doi: Optional[str] = None
    chunk_id: str = Field(..., description="ChromaDB chunk ID for traceability")


class Exercise(BaseModel):
    name: str
    equipment: str
    primary_muscles: list[MuscleGroup]
    secondary_muscles: list[MuscleGroup] = []
    scheme: SetScheme
    coaching_cues: list[str] = Field(default_factory=list)
    science_rationale: str = Field(..., description="1-2 sentence evidence basis")
    citations: list[Citation] = []


class WorkoutDay(BaseModel):
    day_label: str
    exercises: list[Exercise]
    total_volume_per_muscle: dict[str, int] = Field(
        default_factory=dict,
        description="Working sets per muscle group for this day",
    )


class WorkoutRoutine(BaseModel):
    title: str
    weeks: int = Field(default=4, ge=1, le=16)
    frequency: int = Field(..., ge=1, le=7)
    goal: str
    days: list[WorkoutDay]
    periodization_notes: str
    total_weekly_volume: dict[str, int] = Field(
        default_factory=dict,
        description="Total weekly working sets per muscle group",
    )
    citations: list[Citation] = []


class ChatRequest(BaseModel):
    goal: str = Field(..., description="e.g. hypertrophy, strength, fat loss")
    fitness_level: str = Field(..., description="beginner | intermediate | advanced")
    equipment: list[str] = Field(default_factory=list)
    days_per_week: int = Field(..., ge=1, le=7)
    session_minutes: int = Field(default=60, ge=20, le=180)
    injuries: list[str] = Field(default_factory=list)
    additional_context: str = ""
