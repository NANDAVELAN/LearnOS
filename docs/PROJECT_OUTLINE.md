# AI Personalized Learning Companion
## Full-Scale Project Outline & Easy-to-Implement Tech Stack

## 1. Project Vision

**AI Personalized Learning Companion** is a study platform that turns a student's learning material into an adaptive, interactive study experience.

A student uploads PDFs/course material and provides a goal such as:

> "I have 20 days to prepare for Data Mining and I can study 2 hours/day."

The system then:

1. Reads and chunks the learning material.
2. Creates embeddings and stores them in a vector database.
3. Builds a personalized learning roadmap.
4. Teaches topics using RAG-grounded explanations.
5. Generates quizzes from the student's material.
6. Detects weak topics from quiz performance.
7. Automatically adjusts the roadmap.
8. Generates flashcards from weak/important concepts.
9. Tracks progress over time.
10. Uses the webcam locally to estimate attention/fatigue signals.
11. Recommends breaks when sustained inattentiveness is detected.
12. Provides a dashboard showing learning progress and recommendations.

### Core idea

**Document → RAG → Tutor → Quiz → Weak-topic detection → Flashcards → Adaptive roadmap → Progress + Attention signals → Personalized intervention**

---

# 2. Recommended Tech Stack

The goal should be **easy development first**, not maximum complexity.

## Frontend

### React + Vite

Use:

- React
- Vite
- JavaScript/TypeScript
- Tailwind CSS
- Recharts

Why:

- Fast development
- Easy dashboard creation
- Large ecosystem
- Good for interactive quiz/flashcard interfaces
- Easy API integration with FastAPI

---

## Backend

### Python + FastAPI

Use FastAPI as the main backend.

Responsibilities:

- Authentication
- PDF upload
- Document processing
- RAG APIs
- Chat/tutoring
- Quiz generation
- Flashcard generation
- Progress tracking
- Attention events
- Roadmap generation
- Break recommendations

Why FastAPI:

- You already know Python.
- Excellent for AI/ML projects.
- Easy integration with LangChain/LlamaIndex, embeddings, OpenCV and ML libraries.
- Automatic API documentation.

---

# 3. AI / RAG Stack

## LLM

### Gemini API

Use Gemini for:

- Roadmap generation
- Explanations
- Question generation
- Quiz evaluation
- Flashcard generation
- Learning recommendations
- Summarization

Keep the LLM behind your backend API.

Frontend should NEVER directly contain the Gemini API key.

Architecture:

```text
React
   ↓
FastAPI
   ↓
Gemini API
```

---

## RAG Framework

### Start with LangChain

Use LangChain for:

- Document loaders
- Text splitting
- Embeddings
- Retrieval
- Prompt construction
- RAG chains

However, avoid building the entire project around complex LangChain abstractions.

Keep your own simple service layer:

```text
backend/
├── rag/
│   ├── loader.py
│   ├── chunker.py
│   ├── embeddings.py
│   ├── retriever.py
│   └── pipeline.py
```

This keeps the architecture understandable.

---

# 4. LLM Architecture: Gemini + Local Hybrid

A **hybrid LLM architecture** is recommended rather than making the project 100% Gemini or 100% local. Gemini provides stronger reasoning and generation quality, while local models and deterministic Python code reduce API usage, latency, cost, and dependency on rate limits.

## Recommended division

```text
                         AI Learning Companion
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
          Local / Deterministic               Gemini API
                 │                                 │
        ├─ Embeddings                        ├─ Tutor
        ├─ Mastery calculation               ├─ Roadmap generation
        ├─ Weak-topic scoring                ├─ Quiz generation
        ├─ Scheduling                         ├─ Explanations
        ├─ Attention analysis                └─ Complex recommendations
        └─ Flashcard review logic
```

## Why not depend entirely on Gemini?

Gemini API usage is subject to model-specific rate limits such as requests per minute, tokens per minute, and requests per day. A study session can involve multiple AI operations, so the application should minimize unnecessary calls.

Do not make every UI action trigger Gemini. Cache generated roadmaps, explanations, quizzes, and flashcards and regenerate only when meaningful learning-state changes occur.

## Why not use a local LLM for everything?

A small local model is useful as a fallback, but running the entire system locally can introduce model-size, RAM/VRAM, inference-speed, context-length, and deployment constraints. The local model should initially be treated as a fallback rather than the primary reasoning engine.

## LLM provider abstraction

Create a provider interface so the application can switch models without changing the rest of the system:

```text
                 LLMProvider
                     │
             ┌───────┴───────┐
             │               │
          Gemini          Local LLM
             │               │
          Primary         Fallback
```

Conceptually:

```python
if gemini_available:
    response = gemini.generate(prompt)
else:
    response = local_llm.generate(prompt)
```

A local model can be connected later through a lightweight local inference server such as Ollama.

## API-efficient design

Avoid this:

```text
Question 1 → Gemini
Question 2 → Gemini
Question 3 → Gemini
Flashcard 1 → Gemini
Flashcard 2 → Gemini
Roadmap → Gemini
```

Prefer batching related work:

```text
Quiz results + weak topics + learning state
                    ↓
              ONE Gemini call
                    ↓
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Analysis     Flashcards    Roadmap changes
```

## Local-first tasks

The following should normally not require an LLM:

- Quiz score calculation
- Topic mastery updates
- Weak-topic thresholds
- Study-time calculation
- Scheduling
- Spaced-review intervals
- Attention feature extraction
- Camera processing
- Break cooldown logic
- Database operations

This makes the application cheaper, faster, easier to debug, and more reliable.

## Embeddings

Use a local embedding model where practical so document ingestion and retrieval do not consume the main Gemini generation quota:

```text
PDF
 ↓
Chunks
 ↓
Local embedding model
 ↓
ChromaDB

Student question
 ↓
Local query embedding
 ↓
Vector search
 ↓
Top-K chunks
 ↓
Gemini
```

## Camera must remain local

Camera processing should never depend on Gemini:

```text
Webcam
 ↓
OpenCV / MediaPipe
 ↓
Numerical attention features
 ↓
Local attention model/rules
 ↓
Attention state
```

Do not upload webcam frames to Gemini or store them on the backend.

## Final recommendation

**Use Gemini as the reasoning/generation layer, local models for selected high-frequency tasks and fallback, and deterministic Python for everything that does not require generative intelligence.**

This also makes the project stronger from a research perspective because the system can evaluate the combined effect of RAG, mastery modeling, adaptive learning, and privacy-preserving attention signals instead of being only a Gemini chatbot.

---

# 4. PDF Processing

Recommended:

- PyMuPDF (`fitz`) for PDF extraction
- LangChain text splitters

Pipeline:

```text
PDF
 ↓
PyMuPDF
 ↓
Clean text
 ↓
Remove unnecessary whitespace
 ↓
Split into chunks
 ↓
Generate embeddings
 ↓
Vector database
```

For example:

```text
PDF
 ├── Chapter 1
 │    ├── Chunk 1
 │    ├── Chunk 2
 │    └── Chunk 3
 ├── Chapter 2
 │    ├── Chunk 4
 │    └── Chunk 5
```

Store metadata with every chunk:

```json
{
  "document_id": "abc123",
  "chapter": "Introduction to PCA",
  "page": 12,
  "chunk_id": "chunk_034"
}
```

This allows the UI to show where an answer came from.

---

# 5. Vector Database

## Recommended: ChromaDB

Start with **ChromaDB**.

Why:

- Very easy to set up
- Python-friendly
- Good for a student/research project
- Can run locally
- No separate server required for the initial prototype

Later, you can move to:

- Qdrant
- Pinecone
- Weaviate

But do NOT start with a complicated vector infrastructure.

---

# 6. Database

## PostgreSQL

Use PostgreSQL for structured application data.

Store:

- Users
- Documents
- Courses
- Topics
- Roadmaps
- Quiz attempts
- Questions
- Answers
- Flashcards
- Learning sessions
- Attention events
- Break recommendations
- Progress

Recommended ORM:

### SQLAlchemy

Example conceptual schema:

```text
User
 │
 ├── Courses
 │     ├── Documents
 │     ├── Topics
 │     └── Roadmap
 │
 ├── Quiz Attempts
 │
 ├── Flashcards
 │
 ├── Study Sessions
 │
 └── Attention Events
```

---

# 7. Camera / Attention Monitoring

This should be designed as a **privacy-preserving attention estimator**, not a medical or psychological detector.

Do NOT claim that the system can know whether someone is "depressed", "demotivated", or mentally healthy.

Instead detect observable signals such as:

- Face present/not present
- Approximate gaze direction
- Eye openness
- Blink frequency
- Prolonged eye closure
- Head orientation
- Long periods away from screen
- Sustained inactivity

Then infer a simple state such as:

```text
FOCUSED
POSSIBLY_DISTRACTED
FATIGUE_SIGNAL
NO_FACE
```

These are system signals, not diagnoses.

---

# 8. Computer Vision Stack

Use:

### OpenCV

For:

- Webcam capture
- Frame processing
- Camera management

### MediaPipe

For:

- Face landmarks
- Eye landmarks
- Head pose estimation
- Face detection

Pipeline:

```text
Webcam
   ↓
OpenCV
   ↓
MediaPipe Face Landmarks
   ↓
Eye / Head / Face Features
   ↓
Attention Signal
```

---

# 9. Privacy Architecture

This is one of the strongest research aspects of the project.

The camera should be processed locally.

### DO NOT

Upload webcam frames to Gemini or your server.

### Instead

```text
Camera
  ↓
Local browser/device processing
  ↓
Extract numerical signals
  ↓
Send only aggregated events
  ↓
Backend
```

Example:

```json
{
  "session_id": "S102",
  "timestamp": "2026-09-30T15:30:00",
  "face_present": true,
  "attention_score": 0.72,
  "state": "FOCUSED"
}
```

Do not store:

- Images
- Video
- Face photographs
- Face embeddings

This gives you a strong **privacy-preserving** architecture.

---

# 10. Attention Algorithm

Do not start with a complicated deep-learning model.

Start with a rule-based model.

Example features:

```text
eye_closure_duration
head_turn_duration
face_absence_duration
gaze_away_duration
```

Calculate:

```text
attention_score =
    0.40 × eye_attention
  + 0.30 × gaze_attention
  + 0.20 × face_presence
  + 0.10 × head_orientation
```

Then classify:

```text
0.75 - 1.00 → Focused
0.50 - 0.75 → Slightly distracted
0.25 - 0.50 → Attention dropping
0.00 - 0.25 → Break recommended
```

These thresholds should be configurable and validated experimentally rather than presented as universally correct.

---

# 11. Avoid Constant Break Notifications

This is important.

Do not recommend a break because the student looks away for two seconds.

Use a rolling time window.

Example:

```text
Last 5 minutes
      ↓
Calculate average attention
      ↓
If attention remains low
      ↓
Trigger intervention
```

Example:

```text
Attention < 0.40
for > 90 seconds
        ↓
Potential distraction/fatigue
        ↓
Check whether student is in an active study session
        ↓
Recommend short break
```

Add a cooldown:

```text
Break recommendation
        ↓
No new recommendation
for next 20–30 minutes
```

---

# 12. Learning Roadmap

When a student uploads a document, first extract its structure.

Example:

```text
Course: Data Mining

1. Introduction
2. Data Preprocessing
3. Association Rules
4. Classification
5. Clustering
6. PCA
7. SVM
8. Evaluation
```

Then ask the LLM to generate a structured roadmap.

Example:

```json
{
  "topic": "PCA",
  "estimated_hours": 2,
  "difficulty": "medium",
  "prerequisites": ["Linear Algebra"],
  "priority": 0.8
}
```

The backend should store this structured output.

Do NOT store only the LLM's natural-language roadmap.

---

# 13. Adaptive Learning Engine

This is the main intelligence layer.

The system maintains a score for every topic.

Example:

```text
Topic                 Mastery
--------------------------------
Linear Algebra          0.82
PCA                     0.46
SVD                     0.31
Regression              0.76
Clustering              0.61
```

Quiz performance updates mastery.

Example:

```text
Correct answer
     ↓
Topic mastery increases

Wrong answer
     ↓
Topic mastery decreases

Repeated mistakes
     ↓
Topic marked as weak
```

Then:

```text
Weak topic
   ↓
Re-explain
   ↓
Generate examples
   ↓
Generate quiz
   ↓
Generate flashcards
   ↓
Re-test
```

This creates the adaptive loop.

---

# 14. Quiz Generation

Generate quizzes using retrieved document context.

Example prompt structure:

```text
SYSTEM:
You are a tutor.

CONTEXT:
<retrieved chunks>

TOPIC:
PCA

STUDENT LEVEL:
Intermediate

TASK:
Generate 5 questions.

Requirements:
- Questions must be answerable from the context.
- Mix conceptual and numerical questions.
- Return strict JSON.
```

Output:

```json
{
  "questions": [
    {
      "question": "What is the purpose of PCA?",
      "type": "mcq",
      "options": [
        "...",
        "...",
        "...",
        "..."
      ],
      "answer": 2,
      "topic": "PCA",
      "difficulty": "medium"
    }
  ]
}
```

---

# 15. Weak Topic Detection

Do not rely only on percentage score.

Use multiple signals:

```text
Quiz accuracy
+
Question difficulty
+
Number of attempts
+
Recent performance
+
Time taken
```

Example:

```text
PCA

Accuracy: 45%
Recent accuracy: 35%
Attempts: 3
Difficulty: Medium

→ Weak topic
```

Then update roadmap priority.

---

# 16. Flashcard Engine

Flashcards should be generated from:

1. Weak quiz topics
2. Frequently missed questions
3. Important concepts
4. Definitions
5. Formulas
6. Key comparisons

Example:

```text
Quiz detects:

Student repeatedly misses:
"Difference between covariance and correlation"

↓

Generate flashcard

Front:
What is the difference between covariance and correlation?

Back:
Covariance measures joint variation; correlation normalizes it.
```

Use spaced review later.

Basic first version:

```text
New
 ↓
Review tomorrow
 ↓
Review in 3 days
 ↓
Review in 7 days
 ↓
Review in 14 days
```

---

# 17. Tutor Mode

The student can ask:

```text
Explain PCA simply.
```

RAG pipeline:

```text
Question
 ↓
Query embedding
 ↓
Vector search
 ↓
Top-K chunks
 ↓
Context construction
 ↓
Gemini
 ↓
Answer
```

The tutor should answer based on the uploaded material.

Include source information:

```text
Source:
Data Mining Notes
Page 23
```

This reduces hallucination and makes the system academically useful.

---

# 18. Study Session

Create a study-session state machine.

```text
START
  ↓
Choose course
  ↓
Choose topic
  ↓
Start timer
  ↓
Learning
  ↓
Mini quiz
  ↓
Evaluate
  ↓
Update mastery
  ↓
Flashcards
  ↓
Continue / Break
  ↓
END
```

Example session:

```text
09:00
Study PCA

09:25
Mini quiz

09:35
Weakness detected:
Eigenvectors

09:40
Adaptive explanation

09:50
Flashcards

10:00
Break recommendation
```

---

# 19. Dashboard

The dashboard should show:

## Today's Study

```text
Study time       1h 42m
Topics completed  4
Quiz accuracy     78%
Attention         81%
```

## Weak Topics

```text
1. Eigenvalues
2. SVD
3. Covariance Matrix
```

## Recommended Actions

```text
Review SVD
↓
5 flashcards

Practice Eigenvalues
↓
5 quiz questions

Take a 10-minute break
```

## Progress

Use charts:

- Mastery by topic
- Quiz accuracy over time
- Study time
- Completed topics
- Flashcard retention
- Attention trends

---

# 20. Suggested Backend Structure

```text
backend/
│
├── main.py
│
├── api/
│   ├── auth.py
│   ├── documents.py
│   ├── courses.py
│   ├── tutor.py
│   ├── quizzes.py
│   ├── flashcards.py
│   ├── roadmap.py
│   ├── progress.py
│   └── attention.py
│
├── rag/
│   ├── loader.py
│   ├── chunker.py
│   ├── embeddings.py
│   ├── vectorstore.py
│   └── retriever.py
│
├── ai/
│   ├── gemini.py
│   ├── tutor.py
│   ├── quiz_generator.py
│   ├── flashcard_generator.py
│   └── roadmap_generator.py
│
├── learning/
│   ├── mastery.py
│   ├── weak_topics.py
│   ├── adaptation.py
│   └── scheduler.py
│
├── vision/
│   ├── camera.py
│   ├── landmarks.py
│   ├── attention.py
│   └── intervention.py
│
├── models/
│   ├── user.py
│   ├── course.py
│   ├── topic.py
│   ├── quiz.py
│   ├── flashcard.py
│   └── progress.py
│
├── db/
│   ├── database.py
│   └── migrations/
│
└── utils/
    ├── config.py
    └── logging.py
```

---

# 21. Frontend Structure

```text
frontend/
│
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Course.jsx
│   │   ├── Study.jsx
│   │   ├── Quiz.jsx
│   │   ├── Flashcards.jsx
│   │   └── Progress.jsx
│   │
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── ProgressChart.jsx
│   │   ├── TopicCard.jsx
│   │   ├── QuizCard.jsx
│   │   ├── Flashcard.jsx
│   │   ├── StudyTimer.jsx
│   │   └── AttentionIndicator.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   └── App.jsx
```

---

# 22. API Design

Important endpoints:

```text
POST   /auth/register
POST   /auth/login

POST   /documents/upload
GET    /documents

POST   /courses
GET    /courses/{id}

POST   /roadmap/generate
GET    /roadmap/{course_id}

POST   /tutor/chat

POST   /quiz/generate
POST   /quiz/{id}/submit

GET    /progress/{course_id}

POST   /flashcards/generate
GET    /flashcards/{course_id}

POST   /study/start
POST   /study/end

POST   /attention/event
GET    /attention/{session_id}
```

---

# 23. Database Tables

Minimum viable schema:

```text
users
courses
documents
document_chunks
topics
roadmap_items
study_sessions
quiz_questions
quiz_attempts
flashcards
flashcard_reviews
topic_mastery
attention_events
break_recommendations
```

Important relationship:

```text
User
 ↓
Course
 ↓
Document
 ↓
Topics
 ↓
Roadmap
 ↓
Study Sessions
 ↓
Quiz Attempts
 ↓
Topic Mastery
 ↓
Adaptive Roadmap
```

---

# 24. Complete System Architecture

```text
                         ┌──────────────────┐
                         │     Student      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ React + Vite UI  │
                         └────────┬─────────┘
                                  │
                         REST / WebSocket
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │       FastAPI           │
                     │      Backend            │
                     └───────────┬─────────────┘
                                 │
             ┌───────────────────┼────────────────────┐
             │                   │                    │
             ▼                   ▼                    ▼
      ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
      │ RAG Engine  │     │ Learning    │     │ Attention   │
      │             │     │ Engine      │     │ Engine      │
      └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
             │                   │                    │
             ▼                   ▼                    ▼
       ChromaDB             PostgreSQL          Local CV
             │                   │              OpenCV +
             │                   │              MediaPipe
             ▼                   │
        Gemini API               │
             │                   │
             └─────────┬─────────┘
                       ▼
               Personalized Study
                    Engine
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
    Tutor            Quiz          Flashcards
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                Topic Mastery
                       │
                       ▼
               Adaptive Roadmap
```

---

# 25. Development Plan

Do NOT build everything simultaneously.

## Phase 1 — Basic Application

Build:

- React frontend
- FastAPI backend
- PostgreSQL
- User authentication
- Course creation
- PDF upload

Goal:

```text
User → Login → Create Course → Upload PDF
```

---

## Phase 2 — RAG

Build:

- PDF extraction
- Chunking
- Embeddings
- ChromaDB
- Retriever
- Gemini integration

Goal:

```text
Upload PDF
     ↓
Ask question
     ↓
Retrieve relevant text
     ↓
Gemini explanation
```

This is your first major milestone.

---

## Phase 3 — Roadmap

Build:

- Topic extraction
- Course structure
- Learning objectives
- Timeline
- Daily plan

Input:

```text
Course
Available days
Hours/day
Student level
```

Output:

```text
Day 1
Day 2
Day 3
...
```

---

## Phase 4 — Quiz

Build:

- MCQ generation
- Short-answer generation
- Difficulty
- Quiz submission
- Automatic evaluation
- Score storage

---

## Phase 5 — Adaptive Learning

Implement:

```text
Quiz
 ↓
Topic performance
 ↓
Weak topic detection
 ↓
Mastery update
 ↓
Roadmap modification
```

This is where the project becomes genuinely personalized.

---

## Phase 6 — Flashcards

Build:

- Automatic flashcard generation
- Weak-topic flashcards
- Important-concept flashcards
- Review scheduling
- Review history

---

## Phase 7 — Study Dashboard

Add:

- Progress charts
- Topic mastery
- Study time
- Quiz history
- Weak topics
- Recommended actions

---

## Phase 8 — Camera Attention System

Only after the core learning system works.

Build:

- Webcam permission
- OpenCV/MediaPipe processing
- Face detection
- Eye landmarks
- Head pose
- Attention score
- Local processing

Then integrate:

```text
Attention signal
      ↓
Study session
      ↓
Intervention engine
      ↓
Break recommendation
```

---

## Phase 9 — Full Adaptive Companion

Combine everything:

```text
Student
 ↓
Learning goal
 ↓
Roadmap
 ↓
Study
 ↓
Attention monitoring
 ↓
Tutor
 ↓
Quiz
 ↓
Weak-topic detection
 ↓
Flashcards
 ↓
Mastery update
 ↓
Roadmap adaptation
 ↓
Next study session
```

---

# 26. MVP vs Full Version

## MVP

Build only:

```text
PDF upload
   ↓
RAG
   ↓
AI Tutor
   ↓
Quiz
   ↓
Weak Topic Detection
   ↓
Flashcards
   ↓
Progress Dashboard
```

This is enough for a strong working demo.

## Full Version

Add:

```text
Camera attention
+
Adaptive scheduling
+
Personalized interventions
+
Spaced repetition
+
Learning analytics
+
Privacy controls
```

---

# 27. Recommended Final Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | FastAPI |
| Language | Python |
| LLM | Gemini API |
| RAG | LangChain |
| PDF | PyMuPDF |
| Embeddings | Gemini embedding model / compatible embedding API |
| Vector DB | ChromaDB |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Computer Vision | OpenCV |
| Face landmarks | MediaPipe |
| Authentication | JWT |
| API | REST |
| Development | VS Code |
| Version Control | Git + GitHub |
| Deployment | Docker + cloud VM/container platform |

---

# 28. Important Design Decision

Do not make the LLM responsible for everything.

Use this division:

```text
LLM
 ├── Explanation
 ├── Quiz generation
 ├── Flashcard generation
 ├── Roadmap generation
 └── Natural-language recommendations

Python Backend
 ├── Scores
 ├── Mastery
 ├── Scheduling
 ├── Weak-topic detection
 ├── Progress calculation
 └── Database operations

Computer Vision
 ├── Face presence
 ├── Eye state
 ├── Head pose
 └── Attention signals
```

This makes the project easier to debug and much easier to explain in a viva/research paper.

---

# 29. Research Contribution

The strongest research angle is not simply:

> "I made a chatbot that teaches from PDFs."

The stronger system is:

> **A privacy-preserving adaptive learning framework that combines retrieval-grounded LLM tutoring, performance-based knowledge modeling, spaced review, and local attention signals to dynamically personalize learning interventions.**

Possible research components:

1. RAG-grounded tutoring
2. Knowledge/mastery modeling
3. Adaptive roadmap generation
4. Weak-topic detection
5. Automated flashcard generation
6. Privacy-preserving attention estimation
7. Context-aware break recommendation
8. Multimodal learning analytics

---

# 30. Evaluation Metrics

For a serious project/research paper, measure:

## RAG

- Retrieval precision/recall
- Answer faithfulness
- Context relevance
- Hallucination rate

## Quiz

- Question validity
- Difficulty distribution
- Topic coverage
- Student accuracy

## Personalization

Compare:

```text
Static roadmap
vs
Adaptive roadmap
```

Measure:

- Improvement in quiz score
- Weak-topic recovery
- Completion rate
- Study efficiency

## Attention

Measure:

- Face detection reliability
- Attention classification accuracy
- False break recommendations
- Missed attention-loss events

---

# 31. Privacy Requirements

The camera feature should have:

```text
[ ] Camera enabled
[ ] Camera disabled
```

Clearly tell the student:

> Camera frames are processed locally and are not stored or uploaded.

Also allow:

```text
Attention monitoring: ON/OFF
```

The core learning platform must work even when camera monitoring is disabled.

This is important because attention monitoring should be an optional enhancement, not a requirement for using the educational system.

---

# 32. Final User Experience

A student opens the application.

### Step 1

```text
What are you learning?

Upload:
Data Mining.pdf
```

### Step 2

```text
What is your goal?

Exam: 20 days
Study time: 2 hours/day
Current level: Intermediate
```

### Step 3

System generates:

```text
20-Day Data Mining Roadmap
```

### Step 4

Student starts studying.

```text
Today:

✓ Data preprocessing
→ Association Rules
→ Apriori
→ Quiz
```

### Step 5

Student takes quiz.

```text
Score: 6/10

Weak areas:
• Support vs confidence
• Lift
• Apriori pruning
```

### Step 6

System adapts:

```text
Tomorrow's roadmap updated.

Additional 30 minutes:
Apriori concepts
```

### Step 7

Flashcards appear:

```text
5 cards generated from weak topics.
```

### Step 8

During study:

```text
Attention appears to be declining.

Recommendation:
Take a 10-minute break.
```

### Step 9

After the break:

```text
Resume Session
```

The entire system becomes a continuous loop:

```text
LEARN
 ↓
PRACTICE
 ↓
MEASURE
 ↓
IDENTIFY WEAKNESS
 ↓
ADAPT
 ↓
REVIEW
 ↓
LEARN AGAIN
```

---

# 33. Best Build Order

If you want the least painful development path, follow exactly this order:

```text
1. FastAPI + PostgreSQL
2. React + Vite dashboard
3. PDF upload
4. PDF text extraction
5. ChromaDB
6. Embeddings
7. RAG chatbot
8. Course/topic extraction
9. Roadmap generation
10. Quiz generation
11. Quiz evaluation
12. Topic mastery
13. Weak-topic detection
14. Flashcards
15. Progress dashboard
16. Study timer
17. Camera capture
18. MediaPipe attention features
19. Break recommendation
20. Integrate everything
21. Dockerize
22. Deploy
23. Collect evaluation data
24. Write research paper
```

**Most important:** get steps **1–14** working before touching the camera system. The learning/adaptation loop is the core product; computer vision should be an additional module rather than the foundation.

---

# 31. Dockerized Deployment Architecture

Docker should be used as the primary development and deployment environment for the application. Docker Compose can run the frontend, backend, PostgreSQL database, and ChromaDB as separate services.

## Recommended Container Architecture

```text
                    Docker Compose
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
        ▼                ▼                 ▼
   ┌─────────┐      ┌──────────┐     ┌──────────┐
   │ React   │      │ FastAPI  │     │PostgreSQL│
   │Frontend │─────▶│ Backend  │────▶│ Database │
   └─────────┘      └────┬─────┘     └──────────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
            ┌──────────┐      ┌──────────┐
            │ ChromaDB │      │ Gemini   │
            │ VectorDB │      │ API      │
            └──────────┘      └──────────┘
```

## Project Structure

```text
ai-learning-companion/
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── api/
│   ├── rag/
│   ├── ai/
│   ├── learning/
│   └── vision/
│
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
```

## Docker Compose Services

Initial development can use four main containers:

```text
frontend
backend
postgres
chromadb
```

Conceptually:

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - postgres
      - chromadb

  postgres:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data

  chromadb:
    image: chromadb/chroma
    volumes:
      - chroma_data:/data

volumes:
  postgres_data:
  chroma_data:
```

Start the complete environment with:

```bash
docker compose up --build
```

## Camera Processing Should Stay Outside the Backend Container

The webcam should preferably be accessed from the student's browser and processed locally.

```text
Browser
   ↓
Webcam
   ↓
MediaPipe / JavaScript
   ↓
Attention features
   ↓
FastAPI
```

The backend should receive only numerical/aggregated attention signals, for example:

```json
{
  "session_id": "S102",
  "attention_score": 0.72,
  "face_present": true,
  "state": "FOCUSED"
}
```

Do not upload or store raw webcam frames.

## Local LLM + Docker

Initially, keep Ollama outside Docker during Windows-based development if that makes local model management easier:

```text
Docker Compose
├── React
├── FastAPI
├── PostgreSQL
└── ChromaDB

Host machine
└── Ollama
    └── Local LLM
```

The FastAPI backend can communicate with Ollama as an optional fallback provider.

Later, Ollama can be containerized if deployment requirements justify it. GPU/device configuration should be treated as a separate deployment concern.

## Complete Architecture

```text
                         Docker Compose
                              │
                 ┌────────────┼────────────┐
                 │            │            │
                 ▼            ▼            ▼
             React UI      FastAPI     PostgreSQL
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
                 ChromaDB  Gemini     Learning
                           API        Engine
                              │
                              ▼
                         LLMProvider
                         /         \\
                   Gemini       Ollama
                   Primary      Fallback

Browser camera path:

Webcam → Browser → MediaPipe → Attention features → FastAPI
```

## Why Docker

Docker provides:

- Reproducible development environments
- Isolated dependencies
- Easier PostgreSQL/ChromaDB setup
- Consistent deployment
- Easier migration to an EC2/cloud VM later
- Cleaner project demonstration
- Separation between frontend, backend, and data services

## Recommended Docker Strategy

Do not Dockerize everything immediately.

### First

```text
FastAPI
PostgreSQL
ChromaDB
```

### Then

```text
React
```

### Then

```text
Ollama fallback, if required
```

### Keep local/browser-side

```text
Webcam
MediaPipe attention processing
```

The final project should therefore be **Docker-first for application infrastructure, browser-local for privacy-sensitive camera processing, and hybrid for LLM inference**.
