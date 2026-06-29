# 🤖 AI Customer Support Platform

An AI-powered customer support platform that answers user questions from uploaded PDF documents using Retrieval-Augmented Generation (RAG).

The project includes:

- Customer-facing landing page
- AI chat widget
- Admin dashboard
- PDF knowledge base management
- FastAPI backend
- ChromaDB vector database

---

# Features

## Customer Website

- AI Chat Assistant
- Conversation History
- Source Citations
- Typing Indicator
- Responsive Landing Page

## Admin Dashboard

- Upload PDF Knowledge Base
- Delete Documents
- Search Documents
- Dashboard Statistics
- Upload Date
- Duplicate Detection

## Backend

- FastAPI REST API
- ChromaDB Vector Store
- SentenceTransformer Embeddings
- Groq LLM Integration
- Metadata Management

---

# Tech Stack

- Python
- FastAPI
- Groq API
- ChromaDB
- SentenceTransformers
- PyPDF
- HTML
- CSS
- JavaScript

---

# Project Structure

```text
AI-Customer-Support-Platform/

├── frontend/
├── app.py
├── rag_engine.py
├── vector_store.py
├── pdf_processor.py
├── metadata_manager.py
├── document_manager.py
├── model.py
├── requirements.txt
└── README.md
```

---

# Installation

```bash
git clone https://github.com/sabarishwarne2001/ai-customer-support-platform.git

cd ai-customer-support-platform

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload
```

---

# Future Improvements

- FastAPI Background Tasks
- Authentication
- User Management
- Custom Admin Login
- Cloud Storage
- Background Embedding Processing

---

# Author

Sabarish Warne