import json
import re
from typing import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from backend.models.routine import ChatRequest, WorkoutRoutine
from backend.rag.chain import build_rag_chain

router = APIRouter()

ROUTINE_START = "<<<ROUTINE_START>>>"
ROUTINE_END = "<<<ROUTINE_END>>>"


def _sse(event: str, data: str) -> str:
    return f"event: {event}\ndata: {data}\n\n"


def _extract_routine_fallback(text: str) -> WorkoutRoutine | None:
    """Fallback: find a WorkoutRoutine JSON in raw text when delimiters are missing."""
    # Markdown code block
    for m in re.finditer(r"```(?:json)?\s*(\{[\s\S]+?\})\s*```", text):
        try:
            return WorkoutRoutine.model_validate_json(m.group(1))
        except Exception:
            pass
    # Bare JSON object containing "title" and "days"
    for m in re.finditer(r'\{', text):
        try:
            obj = json.loads(text[m.start():])
            if "title" in obj and "days" in obj:
                return WorkoutRoutine.model_validate(obj)
        except Exception:
            pass
    return None


async def _stream_response(request: ChatRequest) -> AsyncGenerator[str, None]:
    chain = build_rag_chain()

    payload = {
        "goal": request.goal,
        "fitness_level": request.fitness_level,
        "equipment": ", ".join(request.equipment) if request.equipment else "standard gym equipment",
        "days_per_week": request.days_per_week,
        "session_minutes": request.session_minutes,
        "injuries": ", ".join(request.injuries) if request.injuries else "None",
        "additional_context": request.additional_context or "None",
    }

    accumulated = ""
    json_done = False       # True once we've seen ROUTINE_END (or given up)
    routine_emitted = False

    try:
        async for chunk in chain.astream(payload):
            accumulated += chunk

            if not json_done:
                # Still waiting for the complete JSON block
                if ROUTINE_END in accumulated:
                    json_done = True
                    if ROUTINE_START in accumulated:
                        raw = accumulated.split(ROUTINE_START, 1)[1].split(ROUTINE_END, 1)[0].strip()
                        try:
                            routine = WorkoutRoutine.model_validate_json(raw)
                            routine_emitted = True
                            yield _sse("routine_update", routine.model_dump_json())
                        except Exception as exc:
                            yield _sse("error", json.dumps({"message": str(exc), "raw": raw[:500]}))

                    # Stream any narrative text that arrived after ROUTINE_END
                    after = accumulated.split(ROUTINE_END, 1)[1]
                    if after.strip():
                        yield _sse("text", json.dumps({"content": after}))
            else:
                # Past the JSON — stream narrative tokens directly
                yield _sse("text", json.dumps({"content": chunk}))

    except Exception as exc:
        yield _sse("error", json.dumps({"message": f"Connection error: {exc}"}))
        yield _sse("done", "{}")
        return

    # Fallback: stream ended without finding delimiters
    if not routine_emitted:
        routine = _extract_routine_fallback(accumulated)
        if routine:
            yield _sse("routine_update", routine.model_dump_json())
        elif ROUTINE_START in accumulated:
            # ROUTINE_START seen but no ROUTINE_END (truncated stream)
            raw = accumulated.split(ROUTINE_START, 1)[1].strip()
            try:
                routine = WorkoutRoutine.model_validate_json(raw)
                yield _sse("routine_update", routine.model_dump_json())
            except Exception:
                pass

    yield _sse("done", "{}")


@router.post("/chat")
async def chat(request: ChatRequest):
    return StreamingResponse(
        _stream_response(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
