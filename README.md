# FitScience AI

Science-based workout routine generator powered by RAG + OpenAI + real-time streaming.

Every recommendation is grounded in peer-reviewed exercise science — with citations.

## Stack

- **Backend**: Python 3.11+ · FastAPI · LangChain · OpenAI GPT-4o · ChromaDB
- **Frontend**: React · TypeScript · Vite · Tailwind CSS · Recharts
- **Streaming**: Server-Sent Events (SSE)

---

## Quick Start

### 1. Backend

> **Run all commands from the repo root** (`langchain-test/`), never from inside `backend/`.

```bash
# From repo root: langchain-test/

# Copy and fill in your keys
cp .env.example .env

# Install Python dependencies
uv sync

# Start the API server
uv run uvicorn backend.main:app --reload --port 8000
```

### 2. Ingest science articles

Drop PDF or `.txt` files into `backend/data/articles/`, then call the ingest endpoint:

```bash
curl -X POST http://localhost:8000/api/ingest \
  -F "file=@backend/data/articles/your_paper.pdf"
```

Or upload through the frontend (coming in v1.1).

### 3. Frontend

```bash
cd frontend

# Install dependencies
bun install

# Start the dev server (proxies /api → localhost:8000)
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## How It Works

1. **You** fill in your goal, fitness level, equipment, schedule, and injuries.
2. **The agent** queries ChromaDB for relevant exercise science chunks (MMR retrieval, k=8).
3. **GPT-4o** streams a narrative explanation + a structured JSON routine delimited by `<<<ROUTINE_START>>>`.
4. **FastAPI** parses the stream and emits two SSE event types:
   - `event: text` → narrative tokens → chat panel (left)
   - `event: routine_update` → validated `WorkoutRoutine` JSON → routine panel (right)
5. **React** renders exercises, volume charts, muscle map, and citations in real time.

---

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app
│   ├── pyproject.toml       # uv dependencies
│   ├── api/routes/
│   │   ├── chat.py          # POST /api/chat (SSE)
│   │   └── ingest.py        # POST /api/ingest (PDF upload)
│   ├── core/config.py       # Settings (OPENAI_API_KEY, etc.)
│   ├── models/routine.py    # Pydantic models
│   ├── rag/
│   │   ├── vectorstore.py   # ChromaDB + embeddings
│   │   ├── ingestor.py      # PDF → chunks → ChromaDB
│   │   └── chain.py         # LCEL RAG chain
│   ├── agent/prompts.py     # System prompt + JSON schema instructions
│   └── data/articles/       # Drop science PDFs here
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── hooks/useStream.ts        # SSE consumer
│   │   ├── types/                    # TypeScript mirrors of Pydantic models
│   │   └── components/
│   │       ├── layout/               # SplitPanel, Header
│   │       ├── chat/                 # ChatPanel, ChatInput, StreamingMessage
│   │       └── routine/              # RoutinePanel, ExerciseCard, VolumeMetrics, MuscleMap
│   └── vite.config.ts
│
└── BUSINESS_PLAN.md
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | — | Required |
| `CHROMA_PERSIST_PATH` | `./data/chroma` | Where ChromaDB stores its files |
| `MODEL_NAME` | `gpt-4o` | OpenAI model to use |
| `EMBEDDING_MODEL` | `text-embedding-3-large` | OpenAI embedding model |

---

## Recommended Science Articles to Ingest

Start with open-access papers from:
- [PubMed Central](https://www.ncbi.nlm.nih.gov/pmc/) (free full-text)
- [Journal of Strength and Conditioning Research](https://journals.lww.com/nsca-jscr)
- [Sports Medicine](https://link.springer.com/journal/40279) (many open-access)

Good search terms: "hypertrophy volume", "resistance training frequency", "progressive overload", "RPE training", "muscle protein synthesis".
