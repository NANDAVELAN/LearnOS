# AI Personalized Learning Companion

An adaptive, interactive full-stack study platform that transforms a student's learning materials into a personalized study companion.

## Core Loop
```text
Document -> RAG -> Tutor -> Quiz -> Weak-topic detection -> Flashcards -> Adaptive roadmap -> Progress dashboard
```

---

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts (`/frontend`)
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Alembic (`/backend`)
- **Database**: PostgreSQL 16
- **Vector Store**: ChromaDB
- **PDF Extraction**: PyMuPDF (`fitz`)
- **Text Splitting**: LangChain splitters
- **Embeddings**: Local `sentence-transformers` (`all-MiniLM-L6-v2`)
- **LLM**: Gemini API via `LLMProvider` abstraction (`GeminiProvider` primary, `OllamaProvider` fallback)
- **Auth**: JWT (JSON Web Tokens)
- **Infrastructure**: Docker Compose (`frontend`, `backend`, `postgres`, `chromadb`)

---

## Repository Structure
```text
LearnOS/
├── backend/
│   ├── api/                 # API route endpoints
│   ├── rag/                 # RAG pipeline: loader, chunker, embeddings, vectorstore
│   ├── ai/                  # LLM providers (Gemini, Ollama) and generators
│   ├── learning/            # Mastery, weak-topic detection, scheduling
│   ├── vision/              # Local privacy-preserving attention signals
│   ├── models/              # SQLAlchemy database models
│   ├── db/                  # Database session and Alembic migrations
│   ├── utils/               # App configuration and logging
│   ├── tests/               # Pytest test suite
│   ├── main.py              # FastAPI application entrypoint
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container definition
│   └── alembic.ini          # Alembic migration configuration
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Dashboard, Course, Study, Quiz, Flashcards, Progress
│   │   ├── components/      # Sidebar, TopicCard, ProgressChart, etc.
│   │   └── services/        # Centralized api.js service with JWT handling
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── docs/
│   └── PROJECT_OUTLINE.md   # Complete architectural specification
├── docker-compose.yml       # 4 services: frontend, backend, postgres, chromadb
├── .env.example             # Example environment variables
├── .env                     # Working environment variables
└── README.md
```

---

## Quickstart with Docker Compose

1. **Clone and enter repository**:
   ```bash
   cd c:\LearnOS
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` if not already present:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` to `.env` (backend only; never exposed to frontend).

3. **Start all services**:
   ```bash
   docker compose up --build
   ```

4. **Access the application**:
   - **Frontend UI**: [http://localhost:5173](http://localhost:5173)
   - **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
   - **ChromaDB**: [http://localhost:8001](http://localhost:8001)

---

## Local Development (Without Docker)

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```
2. Set `DATABASE_URL=sqlite:///./learnos.db` in `.env` if Postgres is not running locally.
3. Start the backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open [http://localhost:5173](http://localhost:5173).

---

## Phase 1 Verification Steps
1. Navigate to [http://localhost:5173](http://localhost:5173).
2. Register a new account (Email, Password, Full Name).
3. Log in with your new credentials.
4. On the Dashboard, create a new course (e.g. "Data Mining", Goal: 20 days, 2 hrs/day, Intermediate).
5. Open the created course and upload a PDF document.
6. Verify the document appears in the uploaded materials list with page count and file size recorded.

