# Veel ICE-Hub (Intelligent Community Engagement Hub)

![Status](https://img.shields.io/badge/Status-Development-blue) 
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi) 
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) 
![DeepSeek](https://img.shields.io/badge/AI-DeepSeek_v4_Flash-black)

**Veel ICE-Hub** is an enterprise-grade backend and simulation dashboard built to intelligently process, classify, and route audience interactions for creators.

Engineered with a strict **Hexagonal Architecture** (Ports and Adapters), it ensures maximum decoupling between core business logic and external infrastructure. The system leverages DeepSeek's `v4-flash` model to act as a community manager—filtering out spam and security threats while actively routing high-value sponsorships into the Veel ecosystem funnel.

---

## 🚀 Key Features

* **Hexagonal Architecture:** Clean separation of concerns (Domain, Ports, Adapters, Services) making the application highly testable and agnostic to UI/Databases.
* **High-Concurrency Batch Processing:** Processes 50+ comments simultaneously using `asyncio` parallel execution, with thread-safe SQLite locks to prevent database corruption.
* **DeepSeek Integration:** Fast, cost-effective LLM processing using `deepseek-v4-flash` via the OpenAI-compatible API format.
* **Intelligent Funnel Routing:** Automatically detects sponsorship or collaboration intents and drafts contextual replies redirecting leads to the creator's official Veel profile.
* **Integrated Admin Dashboard:** Built-in SQLAdmin interface to view, manage, and approve drafted responses in real-time.
* **Glassmorphism UI Simulation:** A React-based sandbox environment that simulates a unified inbox across YouTube, Instagram, TikTok, and Twitter.

---

## 🏗️ Architecture Overview

```text
src/
├── domain/            # Core business entities (Interaction, DraftResponse, Platform Enums)
├── ports/             # Interfaces (Inbound Use Cases, Outbound Repository/LLM Ports)
├── services/          # Core Business Logic (InteractionAnalyzerService, Batch Processing)
├── adapters/          # External Integrations
│   ├── inbound/       # API Routers, DTOs, SQLAdmin Views
│   └── outbound/      # SQLAlchemy SQLite Database, DeepSeek API Service
├── core/              # Dependency Injection, Configuration, Database Engine
└── main.py            # FastAPI Application Entrypoint & Lifespan
```

---

## 🛠️ Tech Stack

* **Backend:** Python 3.10+, FastAPI, SQLAlchemy (Async), SQLAdmin
* **AI/ML:** DeepSeek-v4-flash (OpenAI Python SDK)
* **Database:** SQLite + aiosqlite
* **Frontend:** React (Next.js/Vite), Tailwind CSS, Lucide Icons
* **Package Management:** `uv`

---

## 💻 Installation & Setup

### 1. Backend Setup
Ensure you have [`uv`](https://github.com/astral-sh/uv) installed.

```bash
git clone https://github.com/Shreejal170/veel-ice-hub.git
cd ice-hub

# Create environment and install dependencies
uv venv
uv pip install fastapi uvicorn sqlalchemy aiosqlite pydantic pydantic-settings sqladmin jinja2 openai

# Setup Environment Variables
echo "DEEPSEEK_API_KEY=your_deepseek_api_key_here" > .env
echo "DATABASE_URL=sqlite+aiosqlite:///./veel_dev.db" >> .env
```

### 2. Running the Server
The lifespan function will automatically initialize the database on startup.

```bash
uv run uvicorn src.main:app --reload
```
* **API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **SQLAdmin Dashboard:** [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Usage

### Batch Analyze Interactions
**Endpoint:** `POST /api/v1/analyze/batch`

**Payload:**
```json
{
  "interactions": [
    {
      "platform": "youtube",
      "author_username": "@LogitechGlobal",
      "text_content": "Awesome review! We have a new ergonomic setup...",
      "creator_id": "creator_001"
    }
  ]
}
```

---

## 🔒 Security Notes

* **Concurrency Locks:** The SQLAlchemy database adapter implements an `asyncio.Lock()` to ensure that highly parallel API responses from DeepSeek are committed safely to SQLite.
* **Prompt Firewalls:** The DeepSeek system prompt is engineered to identify injection payloads and flag them strictly as `SECURITY_THREAT` intents.

---

## 👨‍💻 Developed By

**Shreejal KC**  
*AI/ML Intern, Veel*