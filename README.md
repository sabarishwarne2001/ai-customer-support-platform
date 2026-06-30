---
title: AI Customer Support Platform
emoji: 🤖
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# 🤖 AI Customer Support Platform

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_DB-orange)
![Groq](https://img.shields.io/badge/Groq-LLM-black)
![Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?logo=netlify)
![Hugging Face](https://img.shields.io/badge/Backend-Hugging_Face-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

> A production-ready AI Customer Support Platform powered by **FastAPI**, **Groq LLM**, and **Retrieval-Augmented Generation (RAG)** that enables businesses to create an AI-powered customer support assistant from their own PDF documents.

---

## 🚀 Live Demo

### 🌐 Frontend

https://thriving-brigadeiros-807071.netlify.app/

### ⚡ Backend API

https://sabarish22122-ai-customer-support-platform.hf.space/

### 📖 Swagger API Documentation

https://sabarish22122-ai-customer-support-platform.hf.space/docs

### 💻 GitHub Repository

https://github.com/sabarishwarne2001/ai-customer-support-platform

---

# 📌 Business Problem

Businesses receive the same customer questions repeatedly.

Traditional chatbots require manually writing hundreds of FAQs, which become difficult to maintain whenever company information changes.

---

# ✅ Solution

This platform allows administrators to upload company PDF documents and instantly create an AI-powered customer support assistant.

Instead of relying on predefined answers, the assistant searches the uploaded knowledge base using Retrieval-Augmented Generation (RAG) and generates accurate, context-aware responses.

---

# ✨ Features

* 🤖 AI-powered customer support chatbot
* 📄 Upload company PDF documents
* 🧠 Retrieval-Augmented Generation (RAG)
* 🔍 Semantic search using vector embeddings
* 💬 Conversation memory
* 📚 Source citation with every response
* 📋 Knowledge base management dashboard
* 🗂 View uploaded documents
* ❌ Delete documents from the knowledge base
* 📊 Knowledge base statistics
* ⚡ FastAPI REST API
* 🌐 Responsive web interface
* ☁️ Cloud deployment

---

## 🖼 Screenshots

### Landing Page

![Landing Page](assets/landing-page.png)

---

### Customer Chat

![Customer Chat](assets/customer-chat.png)

---

### Admin Dashboard

![Admin Dashboard](assets/admin-dashboard.png)

---

### Upload PDF

![Upload PDF](assets/upload-pdf.png)

---

### Knowledge Base

![Knowledge Base](assets/knowledge-base.png)

---

### Duplicate PDF Detection

![Duplicate PDF](assets/duplicate-pdf.png)

---

# 🏗 System Architecture

![Architecture](assets/architecture.png)

Customer

↓

Frontend (HTML • CSS • JavaScript)

↓

FastAPI Backend

↓

RAG Engine

↓

ChromaDB

↓

Groq LLM

↓

AI Response

---

# 🛠 Technology Stack

## Frontend

* HTML
* CSS
* JavaScript

## Backend

* FastAPI
* Python

## AI

* Groq API
* Llama 3.3
* Sentence Transformers

## Vector Database

* ChromaDB

## PDF Processing

* PyPDF

## Deployment

* Netlify
* Hugging Face Docker Spaces

---

# 📂 Project Structure

```text
frontend/
backend/

├── api
├── rag
├── vector_store
├── uploads
├── requirements.txt
└── main.py
```

---

# 🔌 API Endpoints

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| GET    | /                     | API Status                |
| GET    | /health               | Health Check              |
| POST   | /chat                 | Ask AI Questions          |
| POST   | /upload               | Upload PDF                |
| GET    | /documents            | List Uploaded PDFs        |
| GET    | /stats                | Knowledge Base Statistics |
| DELETE | /documents/{filename} | Delete PDF                |

---

# ⚙ Installation

```bash
git clone https://github.com/sabarishwarne2001/ai-customer-support-platform.git

cd ai-customer-support-platform
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GROQ_API_KEY=your_api_key
```

Run the backend

```bash
uvicorn main:app --reload
```

---

# 🎯 Future Improvements

* User authentication
* Role-based access control
* Streaming AI responses
* Multi-language support
* Analytics dashboard
* Conversation history
* Docker Compose deployment

---

# 👨‍💻 Author

**Sabarish**

Aspiring AI Automation Developer focused on building AI-powered business solutions using FastAPI, RAG, and Large Language Models.

---

# ⭐ If you found this project useful, consider giving it a star.

