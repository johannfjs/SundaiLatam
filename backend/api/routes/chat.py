import json
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
    narrative_flushed = False

    async for chunk in chain.astream(payload):
        accumulated += chunk

        if not in_json:
            if ROUTINE_START in accumulated:
                in_json = True
                # Emit any narrative that came before the delimiter
                narrative = accumulated.split(ROUTINE_START)[0]
                if narrative.strip() and not narrative_flushed:
                    narrative_flushed = True
                    yield _sse("text", json.dumps({"content": narrative}))
                json_buffer = accumulated.split(ROUTINE_START)[1]
            else:
                # Stream narrative tokens progressively
                yield _sse("text", json.dumps({"content": chunk}))
        else:
            json_buffer += chunk
            if ROUTINE_END in json_buffer:
                raw = json_buffer.split(ROUTINE_END)[0].strip()
                try:
                    routine = WorkoutRoutine.model_validate_json(raw)
                    yield _sse("routine_update", routine.model_dump_json())
                except Exception as exc:
                    yield _sse("error", json.dumps({"message": str(exc), "raw": raw[:500]}))
                break

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
