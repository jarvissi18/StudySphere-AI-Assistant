<div align="center">

# 🚀 StudySphere AI Assistant

### AI-Powered Study Assistant using RAG, FastAPI, React, ChromaDB & Google Gemini

<p align="center">
An intelligent study companion that transforms uploaded PDF documents into interactive learning experiences through AI-powered Chat, Summaries, Notes, Flashcards, and Quizzes.
</p>

<p align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-7B61FF?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)

</p>

<p align="center">

![Status](https://img.shields.io/badge/Status-Active_Development-success?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

</p>

</div>

---

# 📖 Overview

**StudySphere AI Assistant** is an AI-powered learning platform designed to improve the way students interact with study materials.

Instead of simply reading PDFs, students can upload their notes and use Artificial Intelligence to:

- 💬 Ask questions from uploaded documents
- 📝 Generate structured summaries
- 📒 Create revision notes
- 🧠 Generate flashcards
- 🎯 Practice with AI-generated quizzes

The application combines **Retrieval-Augmented Generation (RAG)** with **Google Gemini AI** to provide context-aware responses based on uploaded study materials.

---

# ✨ Key Features

### 🤖 AI Chat

- Context-aware conversations
- Answers based on uploaded PDFs
- Retrieval-Augmented Generation (RAG)
- AI-powered question answering

---

### 📑 Smart PDF Processing

- Upload study material
- Automatic text extraction
- Intelligent chunking
- Vector embedding generation
- Semantic search using ChromaDB

---

### 📝 AI Summary

Generate concise summaries including:

- Key Concepts
- Important Points
- Definitions
- Advantages & Disadvantages
- Quick Revision Notes

---

### 📒 AI Notes

Automatically generate:

- Topic-wise notes
- Organized headings
- Bullet points
- Exam-oriented explanations
- Revision-friendly content

---

### 🧠 AI Flashcards

Convert study material into interactive flashcards for:

- Active Recall
- Self Testing
- Memory Retention
- Quick Revision

---

### 🎯 AI Quiz

Generate quizzes directly from uploaded PDFs.

Features include:

- Multiple Choice Questions
- Score Calculation
- Quiz Review
- Performance Feedback

---

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing

---

# 📸 Project Preview

## 🔐 Login

<p align="center">
<img src="docs/login.png" width="900">
</p>

---

## 📝 Register

<p align="center">
<img src="docs/register.png" width="900">
</p>

---

## 🏠 Dashboard

<p align="center">
<img src="docs/dashboard.png" width="900">
</p>

---

## 📂 PDF Upload

<p align="center">
<img src="docs/upload-pdf.png" width="900">
</p>

---

## 💬 AI Chat

<p align="center">
<img src="docs/chat.png" width="900">
</p>

---

## 📝 AI Summary

<p align="center">
<img src="docs/summary.png" width="900">
</p>

---

## 📒 AI Notes

<p align="center">
<img src="docs/notes.png" width="900">
</p>

---

## 🧠 AI Flashcards

<p align="center">
<img src="docs/flashcard.png" width="900">
</p>

---

## 🎯 AI Quiz

<p align="center">
<img src="docs/quiz.png" width="900">
</p>

---

## 📊 Quiz Result

<p align="center">
<img src="docs/quiz-result.png" width="900">
</p>

---

# 🎯 Project Objectives

StudySphere AI aims to:

- Improve learning efficiency
- Enable AI-assisted revision
- Reduce manual note-taking
- Make studying interactive
- Enhance concept understanding
- Simplify exam preparation

---

# 🌟 Highlights

✅ Modern Responsive UI

✅ Retrieval-Augmented Generation (RAG)

✅ FastAPI Backend

✅ React + Vite Frontend

✅ Google Gemini Integration

✅ ChromaDB Vector Database

✅ JWT Authentication

✅ AI Study Companion

---
# ⚙️ Technology Stack

## 🎨 Frontend

| Technology | Purpose |
|------------|---------|
| React.js | User Interface |
| Vite | Fast Development & Build Tool |
| Tailwind CSS | Responsive UI Styling |
| Axios | API Communication |
| React Markdown | Markdown Rendering |
| jsPDF | PDF Export |
| Lucide React | Modern Icons |

---

## ⚡ Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | REST API Development |
| Python | Backend Programming |
| JWT | Authentication |
| Passlib | Password Hashing |
| Pydantic | Data Validation |
| Uvicorn | ASGI Server |

---

## 🤖 Artificial Intelligence

| Technology | Purpose |
|------------|---------|
| Google Gemini | AI Content Generation |
| ChromaDB | Vector Database |
| Sentence Transformers | Embedding Generation |
| RAG | Context-aware AI Responses |

---

## 💾 Database

| Technology | Purpose |
|------------|---------|
| SQLite | User & Application Data |
| ChromaDB | Vector Storage for PDFs |

---

# 🏗️ System Architecture

```text
                ┌──────────────────────────┐
                │        React UI          │
                └────────────┬─────────────┘
                             │
                       Axios API Calls
                             │
                ┌────────────▼─────────────┐
                │        FastAPI API       │
                └────────────┬─────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
 Authentication        PDF Processing      AI Services
          │                  │                  │
          ▼                  ▼                  ▼
     SQLite DB       ChromaDB Vector DB   Gemini AI
```

---

# 🧠 Retrieval-Augmented Generation (RAG) Workflow

```text
PDF Upload
     │
     ▼
Extract Text
     │
     ▼
Chunk Text
     │
     ▼
Generate Embeddings
     │
     ▼
Store in ChromaDB
     │
     ▼
User Question
     │
     ▼
Semantic Search
     │
     ▼
Relevant Chunks Retrieved
     │
     ▼
Gemini AI
     │
     ▼
Context-Aware Response
```

---

# 📂 Project Structure

```text
StudySphere-AI-Assistant
│
├── backend
│   ├── auth
│   ├── database
│   ├── routes
│   ├── schemas
│   ├── services
│   ├── uploads
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docs
│
├── .gitignore
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/jarvissi18/StudySphere-AI-Assistant.git
```

```bash
cd StudySphere-AI-Assistant
```

---

# ⚙️ Backend Setup

Navigate to backend

```bash
cd backend
```

Create Virtual Environment

```bash
python -m venv venv
```

Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn main:app --reload
```

Backend runs at

```text
http://127.0.0.1:8000
```

Swagger API Documentation

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal

```bash
cd frontend
```

Install Packages

```bash
npm install
```

Run Frontend

```bash
npm run dev
```

Frontend runs at

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
SECRET_KEY=YOUR_SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> **Note:** Do not commit your `.env` file to GitHub. Use your own API keys and secrets for local development.

---

# 🔄 Application Workflow

```text
User Login
      │
      ▼
Upload PDF
      │
      ▼
Extract Text
      │
      ▼
Generate Embeddings
      │
      ▼
Store in ChromaDB
      │
      ▼
Select Feature
(Chat / Summary / Notes /
Flashcards / Quiz)
      │
      ▼
Gemini AI
      │
      ▼
Generate Response
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | User login |
| GET | `/auth/me` | Get current user |

---

## PDF Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload PDF |
| GET | `/files` | List uploaded PDFs |
| DELETE | `/delete-file/{id}` | Delete PDF |

---

## AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ask` | AI Chat |
| POST | `/generate-summary` | Generate Summary |
| POST | `/generate-notes` | Generate Notes |
| POST | `/generate-flashcards` | Generate Flashcards |
| POST | `/generate-quiz` | Generate Quiz |

---

# 🤖 AI Modules

### 💬 AI Chat

- Context-aware conversations
- Answers generated from uploaded study material
- Retrieval-Augmented Generation (RAG)
- Semantic search using ChromaDB

---

### 📝 AI Summary

- Structured summaries
- Key concepts
- Definitions
- Advantages & Disadvantages
- Quick revision notes

---

### 📒 AI Notes

- Exam-oriented notes
- Topic-wise organization
- Bullet points
- Revision-friendly formatting

---

### 🧠 AI Flashcards

- Interactive question-answer cards
- Active recall learning
- Quick revision
- Memory retention

---

### 🎯 AI Quiz

- AI-generated MCQs
- Quiz scoring
- Performance review
- Instant feedback

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected API Routes
- Environment Variable Configuration
- Secure User Sessions

---

# 📊 Current Features

| Module | Status |
|---------|:------:|
| User Authentication | ✅ |
| PDF Upload | ✅ |
| AI Chat | ✅ |
| AI Summary | ✅ |
| AI Notes | ✅ |
| AI Flashcards | ✅ |
| AI Quiz | ✅ |
| ChromaDB Integration | ✅ |
| JWT Authentication | ✅ |
| Responsive UI | ✅ |

---

# 🚀 Future Roadmap

- [ ] AI Study Planner
- [ ] Voice-based AI Chat
- [ ] OCR Support for Scanned PDFs
- [ ] Multi-PDF Workspace
- [ ] AI Mind Maps
- [ ] AI Revision Scheduler
- [ ] Spaced Repetition
- [ ] Dark/Light Theme Toggle
- [ ] Docker Support
- [ ] Cloud Deployment

---

# 🎓 Learning Outcomes

This project demonstrates practical experience with:

- Retrieval-Augmented Generation (RAG)
- Large Language Model Integration
- FastAPI Backend Development
- React Frontend Development
- REST API Design
- JWT Authentication
- Vector Databases (ChromaDB)
- AI-powered Document Processing
- Full Stack Application Development

---

# 🤝 Contributing

Contributions are welcome!

If you would like to improve this project:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "feat: add new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Swapnil Suryawanshi**

Computer Engineering Student

GitHub:

https://github.com/jarvissi18

---

# ⭐ Support

If you found this project helpful:

- ⭐ Star this repository
- 🍴 Fork the project
- 💡 Share feedback
- 🛠️ Suggest improvements

---

# 📄 License

This project is intended for educational and learning purposes.

A formal open-source license (such as MIT) can be added in future updates.

---

# 🙏 Acknowledgements

Special thanks to the open-source technologies that made this project possible:

- FastAPI
- React
- Tailwind CSS
- Vite
- Google Gemini
- ChromaDB
- Sentence Transformers
- Lucide React

---

<div align="center">

## ⭐ If you like this project, consider giving it a Star on GitHub!

### Built with ❤️ by Swapnil Suryawanshi

</div>

---

# 🏆 Why StudySphere AI?

Unlike a traditional PDF reader, StudySphere AI transforms static study material into an interactive AI-powered learning experience.

| Traditional Study | StudySphere AI |
|-------------------|----------------|
| Read PDFs manually | 🤖 AI understands PDFs |
| Make notes manually | 📝 AI generates Notes |
| Write summaries | 📑 AI creates Summaries |
| Create flashcards | 🧠 AI generates Flashcards |
| Prepare MCQs manually | 🎯 AI generates Quizzes |
| Search entire PDF | 🔍 Ask questions naturally |

---

# 📊 Project Statistics

| Category | Details |
|----------|---------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI |
| Authentication | JWT |
| AI Model | Google Gemini |
| Vector Database | ChromaDB |
| Embedding Model | Sentence Transformers |
| Database | SQLite |
| Architecture | Retrieval-Augmented Generation (RAG) |

---

# 📈 Project Workflow

```text
                    USER
                      │
                      ▼
              Authentication
                      │
                      ▼
               Upload PDF Files
                      │
                      ▼
             Extract PDF Content
                      │
                      ▼
             Generate Embeddings
                      │
                      ▼
              Store in ChromaDB
                      │
                      ▼
             Semantic Retrieval
                      │
                      ▼
                 Google Gemini
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼
   AI Chat       AI Summary      AI Notes
      │               │               │
      └───────────────┼───────────────┘
                      ▼
             AI Flashcards
                      │
                      ▼
                AI Quiz
```

---

# 📸 Complete Application Preview

| Module | Preview |
|---------|---------|
| Login | ![](docs/login.png) |
| Register | ![](docs/register.png) |
| Dashboard | ![](docs/dashboard.png) |
| PDF Upload | ![](docs/upload-pdf.png) |
| AI Chat | ![](docs/chat.png) |
| Summary | ![](docs/summary.png) |
| Notes | ![](docs/notes.png) |
| Flashcards | ![](docs/flashcards.png) |
| Quiz | ![](docs/quiz.png) |
| Quiz Result | ![](docs/quiz-result.png) |

---

# 💡 Key Highlights

- 📄 Upload multiple study PDFs
- 🤖 AI-powered contextual conversations
- 📝 Automatic summary generation
- 📒 Smart note generation
- 🧠 Interactive flashcards
- 🎯 AI-generated quizzes
- 🔐 Secure JWT authentication
- 📱 Responsive user interface
- ⚡ FastAPI backend with modern architecture
- 🔍 Semantic search using vector embeddings

---

# 🎯 Suitable For

This project is useful for:

- 👨‍🎓 Students
- 👩‍🏫 Teachers
- 📚 Self-learners
- 💼 Interview Preparation
- 🧪 AI/ML Learning
- 🎓 College Projects

---

# 🌍 Deployment (Planned)

| Platform | Status |
|----------|--------|
| Frontend (Vercel) | ⏳ Planned |
| Backend (Render) | ⏳ Planned |
| Database | ⏳ Planned |

---

# 📝 Version History

## v1.0.0

- Initial Release
- JWT Authentication
- PDF Upload
- AI Chat
- AI Summary
- AI Notes
- AI Flashcards
- AI Quiz
- Responsive UI
- ChromaDB Integration

---

# 📬 Contact

**Swapnil Suryawanshi**

- GitHub: https://github.com/jarvissi18

---

<div align="center">

## 🚀 StudySphere AI Assistant

### Empowering students with AI-powered learning.

⭐ **If you found this project useful, consider giving it a star!**

</div>
