# FitScience AI — Setup Guide

Complete step-by-step instructions to get the project running locally from scratch.

---

## Prerequisites

Install these tools before starting:

| Tool | Version | Install |
|------|---------|---------|
| [uv](https://docs.astral.sh/uv/) | latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| [Bun](https://bun.sh/) | latest | `curl -fsSL https://bun.sh/install \| bash` |
| Python | 3.11+ | managed by uv automatically |
| Node.js | 18+ | only needed if not using bun |

Verify:

```bash
uv --version
bun --version
```

---

## 1. Clone the Repository

```bash
git clone <repo-url>
cd langchain-test
```

---

## 2. Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Required: OpenAI
OPENAI_API_KEY=sk-...

# Required: ChromaDB Cloud (https://cloud.trychroma.com)
CHROMA_API_KEY=ck-...
CHROMA_TENANT=your-tenant-uuid
CHROMA_DATABASE=your-database-name

# Optional: defaults shown
MODEL_NAME=gpt-4o
EMBEDDING_MODEL=text-embedding-3-large
```

### Getting your keys

**OpenAI API Key**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Make sure your account has GPT-4o access

**ChromaDB Cloud**
1. Go to [cloud.trychroma.com](https://cloud.trychroma.com)
2. Create an account and a new database
3. Copy your API key, tenant ID, and database name from the dashboard

---

## 3. Backend Setup

All commands run from the **repo root** (not inside `backend/`).

### Install Python dependencies

```bash
uv sync
```

This creates a `.venv/` at the repo root and installs all packages defined in `pyproject.toml`.

### Verify the backend imports

```bash
uv run python -c "from backend.main import app; print('Backend OK')"
```

### Start the API server

```bash
uv run uvicorn backend.main:app --reload --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 4. Ingest Science Articles

The RAG pipeline needs articles in ChromaDB before it can generate grounded routines.

### Option A — Upload via API (recommended)

```bash
curl -X POST http://localhost:8000/api/ingest \
  -F "file=@/path/to/your/paper.pdf"
```

Response:

```json
{ "filename": "paper.pdf", "chunks_added": 42 }
```

### Option B — Bulk ingest from directory

Drop PDFs or `.txt` files into `backend/data/articles/`, then run:

```bash
uv run python -c "
from pathlib import Path
from backend.rag.ingestor import ingest_directory
results = ingest_directory(Path('backend/data/articles'))
for name, count in results.items():
    print(f'{name}: {count} chunks')
"
```

### Recommended open-access sources

- **PubMed Central** — [ncbi.nlm.nih.gov/pmc](https://www.ncbi.nlm.nih.gov/pmc/)
  Search: `hypertrophy volume`, `resistance training frequency`, `progressive overload`
- **Sports Medicine (Springer)** — many papers open access
- **Journal of Strength & Conditioning Research** — check for open-access articles

Aim for at least **10–20 papers** for meaningful retrieval quality.

---

## 5. Frontend Setup

```bash
cd frontend

# Install dependencies
bun install

# Start the dev server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173)

The Vite dev server proxies all `/api/*` requests to `http://localhost:8000`, so both services need to be running.

---

## 6. Running Both Services

Open two terminals:

**Terminal 1 — Backend:**

```bash
# From repo root
uv run uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
bun run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## 7. Using the App

1. **Fill in your profile** (left panel):
   - Goal: `hypertrophy`, `strength`, `fat loss`, etc.
   - Fitness level: beginner / intermediate / advanced
   - Equipment: select what you have available
   - Days per week and session length
   - Any injuries or limitations

2. **Click "Generate Routine"**

3. **Watch it stream in real time**:
   - Left panel: the AI's narrative reasoning (periodization rationale, volume choices)
   - Right panel: structured workout days appear as JSON is parsed — exercises, sets/reps, muscle tags, citations

4. **Explore the routine**:
   - Switch between workout days using the day tabs
   - Volume chart shows weekly sets per muscle group vs. MEV threshold
   - Muscle diagram highlights worked muscles
   - Citations link to DOI when available

---

## 8. Project Structure Reference

```
langchain-test/               ← repo root (run uv commands here)
├── .env                      ← your credentials (gitignored)
├── .env.example              ← template
├── pyproject.toml            ← Python dependencies (uv)
├── uv.lock
│
├── backend/
│   ├── main.py               ← FastAPI app entry point
│   ├── core/
│   │   └── config.py         ← Pydantic settings (reads .env)
│   ├── models/
│   │   └── routine.py        ← WorkoutRoutine, Exercise, ChatRequest, etc.
│   ├── rag/
│   │   ├── vectorstore.py    ← ChromaDB Cloud client + MMR retriever
│   │   ├── ingestor.py       ← PDF/text → chunks → ChromaDB
│   │   └── chain.py          ← LCEL RAG chain (retriever → GPT-4o)
│   ├── agent/
│   │   └── prompts.py        ← System prompt + JSON schema instructions
│   ├── api/routes/
│   │   ├── chat.py           ← POST /api/chat (SSE streaming)
│   │   └── ingest.py         ← POST /api/ingest (PDF upload)
│   └── data/articles/        ← drop PDFs here for bulk ingest
│
├── frontend/
│   ├── vite.config.ts        ← proxy /api → localhost:8000
│   ├── package.json
│   └── src/
│       ├── App.tsx
│       ├── hooks/
│       │   └── useStream.ts  ← SSE reader with AbortController
│       ├── types/
│       │   ├── routine.ts    ← mirrors backend Pydantic models
│       │   └── events.ts     ← SSE discriminated union types
│       ├── api/
│       │   └── chat.ts       ← typed fetch wrapper
│       └── components/
│           ├── layout/       ← SplitPanel (resizable), Header
│           ├── chat/         ← ChatPanel, ChatInput, StreamingMessage
│           └── routine/      ← RoutinePanel, ExerciseCard, VolumeMetrics,
│                                MuscleMap, CitationList
│
├── README.md
├── SETUP.md                  ← this file
└── BUSINESS_PLAN.md
```

---

## 9. Architecture Overview

```
Browser (localhost:5173)
  │
  │  POST /api/chat  { goal, fitness_level, equipment, ... }
  │
  ▼
Vite dev proxy  ──────────────────────────────────────────────►  FastAPI (localhost:8000)
                                                                      │
                                                                      │  1. build_rag_chain()
                                                                      │  2. retriever.invoke(query)
                                                                      │        │
                                                                      │        ▼
                                                                      │   ChromaDB Cloud
                                                                      │   MMR search, k=8
                                                                      │        │
                                                                      │  3. ChatOpenAI(gpt-4o, streaming=True)
                                                                      │     astream(payload)
                                                                      │
                                                                      │  4. StreamingResponse (text/event-stream)
                                                                      │
  ◄───────────────────────────────────────────────────────────────────┘
  │
  │  event: text          → narrative tokens
  │  event: routine_update → WorkoutRoutine JSON (Pydantic-validated)
  │  event: done
  │
  ▼
useStream hook
  ├── narrative  → ChatPanel   (left: streaming text + cursor)
  └── routine    → RoutinePanel (right: ExerciseCards, VolumeMetrics, MuscleMap, Citations)
```

---

## 10. Troubleshooting

### `ModuleNotFoundError: No module named 'backend'`

Run uvicorn from the **repo root**, not from inside `backend/`:

```bash
# Correct ✓
uv run uvicorn backend.main:app --reload

# Wrong ✗
cd backend && uv run uvicorn main:app
```

### `ValidationError: chroma_api_key field required`

Your `.env` file is missing ChromaDB credentials. Check that `.env` exists at the repo root and has `CHROMA_API_KEY`, `CHROMA_TENANT`, and `CHROMA_DATABASE` set.

### SSE stream not updating the right panel

Make sure the LLM output includes the `<<<ROUTINE_START>>>` delimiter. If the ChromaDB collection is empty (no articles ingested), the model may fall back to a shorter response. Ingest at least a few articles first.

### Routine JSON parse error

The model occasionally produces invalid JSON. The backend emits an `event: error` SSE message with the raw string. Check the browser console (`Network → EventStream`) to inspect the raw stream.

### Vite proxy not forwarding to backend

Ensure the backend is running on port 8000 **before** starting the frontend. The proxy is configured in [frontend/vite.config.ts](frontend/vite.config.ts).

### `chromadb.CloudClient` connection error

Verify your `CHROMA_API_KEY`, `CHROMA_TENANT`, and `CHROMA_DATABASE` are correct. Test with:

```bash
uv run python -c "
import chromadb
from backend.core.config import get_settings
s = get_settings()
client = chromadb.CloudClient(api_key=s.chroma_api_key, tenant=s.chroma_tenant, database=s.chroma_database)
print('Collections:', client.list_collections())
"
```
