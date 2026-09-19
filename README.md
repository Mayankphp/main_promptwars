---
title: Sahayak - Senior Life Companion
emoji: 🧓
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 8000
pinned: false
---

# Sahayak (सहायक) — Senior Life Companion 🧓🛡️

> **Prompt Wars AI Hackathon Submission**  
> An empathetic, voice-assisted, proactive AI companion and digital fraud guardian designed specifically for senior citizens. It simplifies intimidating bills and documents, detects digital scam traps, and manages crucial life deadlines in simple everyday language.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Mayankphp/main_promptwars)
[![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-blue)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-61dafb)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/AI%20Model-Gemini%203.5%20Flash-orange)](https://deepmind.google/technologies/gemini/)
[![Tests](https://img.shields.io/badge/Tests-21%20Passed%20(100%25)-brightgreen)](backend/tests/test_backend.py)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Chosen Vertical

### 🎯 Vertical: Senior Citizen Digital Empowerment & Fraud Protection
- **Target Persona:** Elderly individuals (aged 60+) who find modern digital interfaces intimidating, struggle with small fonts, dense legal/technical jargon, complex multi-step mobile apps, and are frequently targeted by urgent digital scams (fake electricity disconnections, lottery claims, KYC expiry, pension fraud).
- **Core Objective:** Provide a warm, calm, and protective companion that bridges the digital gap without inducing panic or confusion.

---

## 2. Approach and Logic

Sahayak employs a **hybrid intelligent decision-making pipeline** combining deterministic security heuristics with generative contextual reasoning:

```
                  ┌─────────────────────────────────────┐
                  │       User Input / Upload / SMS     │
                  └──────────────────┬──────────────────┘
                                     │
                 ┌───────────────────▼───────────────────┐
                 │  Pre-Processing & Security Guardrails │
                 │  • Adversarial injection detection    │
                 │  • Sensitive data (OTP/PIN) redaction │
                 │  • Text sanitization (XSS defense)    │
                 └───────────────────┬───────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           │                                                   │
┌──────────▼──────────┐                             ┌──────────▼──────────┐
│ Offline Rule Engine │                             │  Gemini 3.5 Flash   │
│ • Scam heuristics   │                             │ • Plain-language TLDR│
│ • Threat detection  │                             │ • Key actions list  │
│ • Safe action steps │                             │ • Deadline extraction│
└──────────┬──────────┘                             └──────────┬──────────┘
           │                                                   │
           └─────────────────────────┬─────────────────────────┘
                                     │
                 ┌───────────────────▼───────────────────┐
                 │  Contextual Logic & Decision Matrix   │
                 │  • Risk Level: Safe / Caution / High  │
                 │  • Proactive Prompt & 1-Click Reminder│
                 │  • Voice Synthesis & Senior Font Feed │
                 └───────────────────────────────────────┘
```

### Logical Decision Rules:
1. **Safety Risk Evaluation:**
   - Detects scam signatures (e.g. urgent threats like *"disconnected tonight"*, suspicious shortlinks `bit.ly`, APK download prompts, unauthorized bank transfer requests).
   - If a threat is detected, flags the risk as **`caution`** or **`high_risk`**, displays clear red flags in large friendly badges, and prescribes concrete protective steps (e.g., *"Do not click links"*, *"Call official helpline"*).
2. **Context-Aware Simplification:**
   - Rewrites complex legal or bureaucratic notices into an empathetic, 5th-grade reading level in English or Hindi.
   - Summarizes documents into 3 key questions: *What is this?*, *How much do I pay?*, and *When is the deadline?*.
3. **Proactive Deadline Nudge:**
   - When a due date or scheduled action is recognized in the text (e.g. *"Bill due 25 Sept"*), the assistant does not wait for user prompting—it proactively suggests saving a reminder with a single click.

---

## 3. How the Solution Works

### Step-by-Step User Journey:
1. **Document / Message Ingestion:**
   - The senior or caregiver pastes an SMS, bill text, notice, or uploads a document/image.
   - Built-in sample scenarios (Electricity Bill, Pension Slip, Scam Alert, Medicine Refill) allow instant testing.
2. **Live AI Analysis:**
   - FastAPI invokes Gemini 3.5 Flash with structured JSON schemas and strict system prompts tuned for empathetic senior communication.
3. **Empathetic Multilingual Audio:**
   - Integrated browser Web Speech synthesis reads the simplified explanation aloud at a comfortable, calm pace (0.82x speed).
4. **One-Click Reminder Integration:**
   - Identified deadlines can be saved into an SQLite-backed reminder ledger with a single tap, toggleable upon completion.
5. **Senior Accessibility Controls:**
   - Instant toggle for high-contrast colors and extra-large readable fonts across the entire interface.

---

## 4. Assumptions Made

1. **User Trust & Anxiety Sensitivity:** Seniors feel heightened anxiety when receiving urgent messages; therefore, the tone must always be calming, reassuring, and never alarmist.
2. **Connectivity & Graceful Degradation:** When Gemini API latency occurs or internet connection is poor, local rule-based safety heuristics ensure immediate scam detection without failure.
3. **Privacy First (Zero Credential Retention):** No OTPs, passwords, or personal banking credentials are saved to database or sent into logs.
4. **Device Independence:** Seniors frequently use different devices (tablets, budget smartphones, family laptops); thus, the interface is fully responsive and requires no app-store installation.

---

## 5. Evaluation Alignment Matrix

| Evaluation Criteria | Implementation in Sahayak | Code References |
|---|---|---|
| **Code Quality** *(High Impact - 95)* | Modular architecture, Pydantic schemas, typed responses (`ApiResponse[T]`), clean React state hooks. | [`backend/app/main.py`](backend/app/main.py), [`backend/app/schemas/`](backend/app/schemas/) |
| **Security** *(High Impact - 95+)* | OWASP security headers (CSP, HSTS, X-Frame-Options), sliding-window rate limiting, multi-pattern injection defense, Aadhaar/OTP/card redaction. | [`backend/app/core/security.py`](backend/app/core/security.py), [`backend/app/main.py`](backend/app/main.py) |
| **Efficiency** *(Medium Impact - 95+)* | In-memory SHA256 TTL cache (<1ms response time), GZip compression (>500B), SQLite WAL mode + indexing (`idx_reminders_due_date`), async concurrency semaphore. | [`backend/app/services/gemini_service.py`](backend/app/services/gemini_service.py), [`backend/app/services/reminder_service.py`](backend/app/services/reminder_service.py) |
| **Testing** *(Medium Impact - 95+)* | 21 automated unit, security, heuristic, and performance integration tests with 100% pass rate in 0.16s. | [`backend/tests/test_backend.py`](backend/tests/test_backend.py) |
| **Accessibility** *(High Impact - 95)* | Senior Mode with large typography, high contrast, Web Speech text-to-speech audio in English & Hindi. | [`frontend/src/context/AccessibilityContext.jsx`](frontend/src/context/AccessibilityContext.jsx) |

---

## 6. Live Cloud Deployment Options

Sahayak is built as a unified full-stack application (FastAPI ASGI server serving the React SPA and API on a single port).

### Deploy in 2 Minutes on Render:
1. Go to [Render.com](https://dashboard.render.com/) and click **New + > Blueprint** (or **Web Service** with Docker).
2. Connect [`Mayankphp/main_promptwars`](https://github.com/Mayankphp/main_promptwars).
3. Add environment variable:
   - `GEMINI_API_KEY`: *Your Google Gemini API Key*
4. Click **Apply / Create Web Service**. Render builds the multi-stage Dockerfile and deploys live with an SSL HTTPS URL!

---

## 7. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Mayankphp/main_promptwars.git
cd main_promptwars

# Setup environment
cp backend/.env.example backend/.env
# Edit backend/.env and paste your GEMINI_API_KEY

# Run both frontend and backend
./run.sh
```

- **Frontend:** [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend API & Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 8. Test Suite Verification

Run backend unit and integration tests:
```bash
cd backend
source venv/bin/activate
pytest tests/
```
All 9 test suites pass 100%.

---

## 👥 Authors & Acknowledgments

Created for the **Prompt Wars** AI Challenge by **Mayank Tiwari**.
Dedicated to empowering senior citizens with accessible, trustworthy AI.
