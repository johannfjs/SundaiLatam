import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from backend.rag.ingestor import ingest_file

router = APIRouter()


class IngestResponse(BaseModel):
    filename: str
    chunks_added: int


@router.post("/ingest", response_model=IngestResponse)
async def ingest(file: UploadFile = File(...)):
    """Upload a PDF or text file to ingest into the RAG knowledge base."""
    suffix = Path(file.filename or "upload").suffix.lower()
    if suffix not in {".pdf", ".txt", ".md"}:
        raise HTTPException(status_code=400, detail="Only .pdf, .txt, and .md files are supported.")

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        count = ingest_file(tmp_path)
    finally:
        tmp_path.unlink(missing_ok=True)

    return IngestResponse(filename=file.filename or "upload", chunks_added=count)
