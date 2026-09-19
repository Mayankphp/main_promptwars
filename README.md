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
> An empathetic, voice-assisted, and proactive AI companion designed specifically for senior citizens. It simplifies intimidating utility bills, legal/medical documents, and alerts seniors to digital frauds, phishing, and fake disconnection scams in their native language with warm, high-contrast, large-type accessibility.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Mayankphp/main_promptwars)
[![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-blue)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-61dafb)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/AI%20Model-Gemini%203.5%20Flash-orange)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 The Problem Sahayak Solves

Modern digital life is filled with rapid SMS alerts, cryptic utility bills, intimidating bureaucratic notices, and predatory digital scams. For elderly citizens, navigating small phone screens, dense legal jargon, and urgent scam messages is stressful, confusing, and financially dangerous.

**Sahayak** acts as a trustworthy digital companion:
1. **Plain Language Explainer**: Breaks down utility bills, bank statements, pension notices, and hospital slips into simple, jargon-free bullet points.
2. **Proactive Scam Shield**: Scans messages for urgency traps, fake APKs, unverified links, and electricity disconnection threats before seniors panic or pay fraudsters.
3. **Senior-Centric Accessibility**: High-contrast modes, large readable typography, and native text-to-speech audio playback in English, Hindi, and regional languages.
4. **Proactive Reminders**: Automatically extracts deadlines and payment dates, prompting seniors to save them with a single click without having to fiddle with complex calendars.

---

## 🚀 Live Cloud Deployment Options

Sahayak is built as a production-grade, containerized full-stack application (FastAPI ASGI server serving both the REST API and the React SPA).

### Option 1: 1-Click Deploy on Render (Recommended)

1. Fork or import [`Mayankphp/main_promptwars`](https://github.com/Mayankphp/main_promptwars.git) to your GitHub.
2. Go to [Render.com](https://dashboard.render.com/) and click **New + > Web Service**.
3. Connect your repository `main_promptwars`.
4. Render will auto-detect the `render.yaml` / `Dockerfile`:
   - **Environment:** Docker
   - **Plan:** Free
5. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: *Your Google Gemini API Key*
6. Click **Create Web Service**. Your live HTTPS URL (e.g. `https://sahayak-companion.onrender.com`) will be online in ~2 minutes!

---

### Option 2: 1-Click Deploy on Railway

1. Go to [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select `Mayankphp/main_promptwars`.
4. Go to **Variables** and add `GEMINI_API_KEY`.
5. Railway automatically builds the multi-stage Dockerfile and generates a public domain under Settings -> Networking.

---

### Option 3: Hugging Face Spaces

1. Create a new Space on [Hugging Face Spaces](https://huggingface.co/spaces).
2. Choose **Docker** as the Space SDK.
3. Push or connect this repository.
4. Add your `GEMINI_API_KEY` under Space Settings -> Variables and Secrets.

---

## 🛠️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   React 18 SPA (Vite)                  │
│   • Senior Accessibility System (Font scaling, Contrast)│
│   • Text-to-Speech Voice Engine (Multilingual)         │
│   • Document Upload & OCR Text Extractor               │
│   • Proactive Action Cards & One-Click Reminders       │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST
┌───────────────────────────▼────────────────────────────┐
│                  FastAPI Backend Server                │
│   • Multi-layer Security (Input Sanitization, Defenses)│
│   • Scam Detection Heuristics & Verification Engine    │
│   • SQLite + aiosqlite Async Deadline Database         │
│   • Unified Static SPA Asset Serving                   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│               Google Gemini 3.5 Flash                  │
│   • Structured Output & Reasoning Analysis             │
│   • Empathetic, Calm Senior Tone Transformation        │
└────────────────────────────────────────────────────────┘
```

---

## 💻 Local Development Setup

To run Sahayak locally on your machine:

### Prerequisites
- Python 3.12+
- Node.js 18+

### Quick Start (Single Script)
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

## 🛡️ Trust, Privacy & Safety Measures

- **No Plaintext Credential Exposure:** OTPs, PINs, passwords, and sensitive account tokens are stripped before logging.
- **Strict Content Sanitization:** Untrusted inputs from SMS, bills, or OCR uploads are sanitized against HTML/XSS and adversarial prompt injection.
- **Empathetic Assurance:** Output messaging is specially tuned to reassure seniors rather than induce anxiety.
- **Fail-Safe Fallbacks:** Offline heuristic scanners continue detecting scam signatures even if network connectivity is intermittent.

---

## 🧪 Test Suite

Run backend unit and integration tests:
```bash
cd backend
source venv/bin/activate
pytest tests/
```
All 9 test suites validate security guardrails, scam heuristics, reminder CRUD, and SPA fallback routing.

---

## 👥 Authors & Acknowledgments

Created for the **Prompt Wars** AI Challenge by **Mayank Tiwari**.
Dedicated to empowering senior citizens with accessible, trustworthy AI.
