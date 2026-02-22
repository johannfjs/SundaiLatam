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
# Hold back this many chars at the tail of the narrative so a split delimiter
# never gets emitted as text before we've confirmed it's a delimiter.
_LOOKAHEAD = len(ROUTINE_START)


def _sse(event: str, data: str) -> str:
    return f"event: {event}\ndata: {data}\n\n"


def _extract_routine(text: str) -> WorkoutRoutine | None:
    """Try every reasonable strategy to extract a WorkoutRoutine from raw text."""
    # Strategy 1: explicit delimiters (happy path)
    if ROUTINE_START in text:
        after = text.split(ROUTINE_START, 1)[1]
        raw = after.split(ROUTINE_END, 1)[0].strip() if ROUTINE_END in after else after.strip()
        try:
            return WorkoutRoutine.model_validate_json(raw)
        except Exception:
            pass

    # Strategy 2: markdown code block  ```json ... ```
    for m in re.finditer(r"```(?:json)?\s*(\{[\s\S]+?\})\s*```", text):
        try:
            return WorkoutRoutine.model_validate_json(m.group(1))
        except Exception:
            pass

    # Strategy 3: find the outermost JSON object that contains "title" and "days"
    for m in re.finditer(r'\{', text):
        candidate = text[m.start():]
        try:
            obj = json.loads(candidate)
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
    in_json = False
    json_buffer = ""
    routine_emitted = False
    # Lookahead buffer: holds the last _LOOKAHEAD chars so a partial delimiter
    # is never sent to the client before we know it's not a real delimiter.
    pending = ""

    try:
        async for chunk in chain.astream(payload):
            accumulated += chunk

            if not in_json:
                if ROUTINE_START in accumulated:
                    in_json = True
                    # Discard pending — it may contain the partial delimiter
                    pending = ""
                    json_buffer = accumulated.split(ROUTINE_START, 1)[1]
                else:
                    pending += chunk
                    # Safely emit all but the last _LOOKAHEAD chars
                    if len(pending) > _LOOKAHEAD:
                        safe = pending[:-_LOOKAHEAD]
                        pending = pending[-_LOOKAHEAD:]
                        yield _sse("text", json.dumps({"content": safe}))
            else:
                json_buffer += chunk
                if ROUTINE_END in json_buffer:
                    raw = json_buffer.split(ROUTINE_END, 1)[0].strip()
                    try:
                        routine = WorkoutRoutine.model_validate_json(raw)
                        routine_emitted = True
                        yield _sse("routine_update", routine.model_dump_json())
                    except Exception as exc:
                        yield _sse("error", json.dumps({"message": str(exc), "raw": raw[:500]}))
                    break

    except Exception as exc:
        yield _sse("error", json.dumps({"message": f"Connection error: {exc}"}))
        yield _sse("done", "{}")
        return

    # Flush any remaining narrative that never triggered the delimiter
    if not in_json and pending:
        yield _sse("text", json.dumps({"content": pending}))

    # Fallback: delimiter(s) missing — try to extract routine from full text
    if not routine_emitted:
        routine = _extract_routine(accumulated)
        if routine:
            routine_emitted = True
            yield _sse("routine_update", routine.model_dump_json())
        elif in_json and json_buffer.strip():
            try:
                routine = WorkoutRoutine.model_validate_json(json_buffer.strip())
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
