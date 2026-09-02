# MemoMate 🌱 — AI-Based Cognitive Gaming & Memory Assistance Platform

**Problem Statement ID:** SIH26003  
**Problem Statement:** AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Patients in North Eastern Region (NER)  
**Theme:** MedTech / BioTech / HealthTech  
**Technology:** MERN Stack (MongoDB Atlas, Express.js, React.js, Node.js + Groq Llama-3 AI)

---

## 🌟 Core Innovation — Adaptive Cognitive Path

Unlike generic memory game websites, MemoMate's core innovation is its **Adaptive Cognitive Recommendation Engine**, which runs the continuous loop:

```
PLAY → RECORD → ANALYSE → PERSONALIZE → REPEAT
```

1. **PLAY**: Elderly user completes interactive, elderly-friendly games (Memory Match, Attention Challenge, Number Recall, Pattern Recall, Reaction Test, Regional Word Recall).
2. **RECORD**: System records metric scores across **Memory**, **Attention**, **Recall**, and **Reaction** time/accuracy.
3. **ANALYSE**: Node.js backend algorithm & Groq Llama-3 LLM evaluate performance and identify the user's weakest cognitive area (e.g. Memory: 82, Attention: 64 -> Attention identified).
4. **PERSONALIZE**: Automatically generates a targeted recommendation (e.g. Attention Challenge on Medium difficulty) with live Groq AI encouragement.
5. **REPEAT**: Progress waters plants and blooms flowers in the user's virtual **Memory Garden**.

---

## 📁 Project Structure

```text
SIH/
├── frontend/                   # Vite + React Frontend SPA
│   ├── src/
│   │   ├── components/         # AccessibilityBar, Navbar, Sidebar, ScoreCard, Path, GardenPreview, ProgressChart
│   │   ├── context/            # AuthContext & Accessibility state
│   │   ├── games/              # MemoryMatch, AttentionChallenge, NumberRecall, PatternRecall, ReactionTest, WordRecall
│   │   ├── pages/              # Login, Register, UserDashboard, Assessment, AIAnalysis, CognitivePathPage, ProgressPage, MemoryGardenPage, CaregiverDashboard
│   │   ├── services/           # Axios API service module
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                    # Node.js + Express + Mongoose + Groq SDK Backend
│   ├── controllers/            # Auth, Session, Cognitive, Recommendation, Garden, Caregiver
│   ├── middleware/             # JWT Auth middleware
│   ├── models/                 # User, CognitiveSession, CognitiveProfile, Recommendation, GardenProgress
│   ├── routes/                 # Express REST endpoints
│   ├── utils/                  # recommendationEngine & groqService
│   ├── .env                    # MongoDB Atlas & Groq API key configuration
│   ├── server.js
│   └── package.json
│
├── .env.example                # Environment configuration template
└── README.md                   # Complete documentation
```

---

## 🚀 How to Run the Project

### 1. Backend Server Setup
```bash
cd backend
npm run dev
```
The Express API server starts at `http://localhost:5000` (connected to MongoDB Atlas & Groq Llama-3 AI).

### 2. Frontend React Client Setup
```bash
cd frontend
npm run dev
```
The React Vite app starts at `http://localhost:3000`.

---

## 🔑 Demo Login Credentials

- **Elderly Patient (Meena, Age 68)**:
  - Click **"Log in as Patient (Meena, 68)"** button on the Login screen!
  - Email: `meena@example.com` | Password: `password123`
- **Caregiver (Dr. Sharma)**:
  - Click **"Log in as Caregiver (Dr. Sharma)"** button on the Login screen!
  - Email: `caregiver@example.com` | Password: `password123`
