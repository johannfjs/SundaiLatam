from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


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


# Map common LLM aliases → canonical enum values
_MUSCLE_ALIASES: dict[str, MuscleGroup] = {
    "lower back": MuscleGroup.BACK,
    "upper back": MuscleGroup.BACK,
    "lats": MuscleGroup.BACK,
    "latissimus": MuscleGroup.BACK,
    "rhomboids": MuscleGroup.BACK,
    "erector spinae": MuscleGroup.BACK,
    "spinal erectors": MuscleGroup.BACK,
    "deltoids": MuscleGroup.SHOULDERS,
    "delts": MuscleGroup.SHOULDERS,
    "anterior deltoid": MuscleGroup.SHOULDERS,
    "posterior deltoid": MuscleGroup.SHOULDERS,
    "rear delts": MuscleGroup.SHOULDERS,
    "pecs": MuscleGroup.CHEST,
    "pectorals": MuscleGroup.CHEST,
    "abs": MuscleGroup.CORE,
    "abdominals": MuscleGroup.CORE,
    "obliques": MuscleGroup.CORE,
    "hip flexors": MuscleGroup.CORE,
    "rectus abdominis": MuscleGroup.CORE,
    "hip abductors": MuscleGroup.GLUTES,
    "hip adductors": MuscleGroup.QUADS,
    "quadriceps": MuscleGroup.QUADS,
    "rectus femoris": MuscleGroup.QUADS,
    "vastus lateralis": MuscleGroup.QUADS,
    "hamstring": MuscleGroup.HAMSTRINGS,
    "biceps femoris": MuscleGroup.HAMSTRINGS,
    "gastrocnemius": MuscleGroup.CALVES,
    "soleus": MuscleGroup.CALVES,
    "brachialis": MuscleGroup.BICEPS,
    "brachioradialis": MuscleGroup.FOREARMS,
    "wrist flexors": MuscleGroup.FOREARMS,
    "wrist extensors": MuscleGroup.FOREARMS,
    "upper trapezius": MuscleGroup.TRAPS,
    "serratus anterior": MuscleGroup.BACK,
}


def _coerce_muscle(value: str | MuscleGroup) -> MuscleGroup | None:
    """Return a valid MuscleGroup or None (to be filtered out)."""
    if isinstance(value, MuscleGroup):
        return value
    lower = value.lower().strip()
    # Try exact enum match first
    try:
        return MuscleGroup(lower)
    except ValueError:
        pass
    # Try alias map
    if lower in _MUSCLE_ALIASES:
        return _MUSCLE_ALIASES[lower]
    # Partial match: if the value contains a valid enum name, use it
    for member in MuscleGroup:
        if member.value in lower or lower in member.value:
            return member
    return None  # unknown → drop silently


def _coerce_muscle_list(values: list) -> list[MuscleGroup]:
    result = []
    for v in values:
        coerced = _coerce_muscle(v)
        if coerced is not None:
            result.append(coerced)
    return result


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

    @field_validator("primary_muscles", "secondary_muscles", mode="before")
    @classmethod
    def coerce_muscles(cls, v: list) -> list[MuscleGroup]:
        return _coerce_muscle_list(v)


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
