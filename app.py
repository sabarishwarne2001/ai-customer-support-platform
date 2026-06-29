from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from model import ChatRequest, ChatResponse
from rag_engine import ask_rag
import shutil
import os

from pdf_processor import extract_text_from_pdf, create_chunks

from vector_store import (
    store_chunks,
    document_exists,
    get_chunk_count,
    delete_document,
    get_document_chunk_count
)

from document_manager import (
    get_uploaded_documents,
    get_document_count,
    delete_uploaded_document,
)

from metadata_manager import add_document
from metadata_manager import get_upload_date
from metadata_manager import remove_document

app = FastAPI(
     title="AI Customer Support Platform API",
    description="Production-ready REST API for an AI-powered customer support platform with PDF knowledge base, Retrieval-Augmented Generation (RAG), and document management.",
    version="1.0.0",
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # We'll tighten this later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI Customer Support Platform API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "running"
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:
        answer = ask_rag(request.message)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    return {
        "response": answer
    }


@app.post("/upload")
def upload_pdf(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if document_exists(file.filename):
        return {
    "success": False,
    "message": "This PDF already exists.",
    "data": None
        }

    text = extract_text_from_pdf(file_path)

    chunks = create_chunks(text)

    store_chunks(chunks, file.filename)
    add_document(file.filename)

    return {
    "success": True,
    "message": "PDF uploaded successfully.",
    "data": {
        "filename": file.filename,
        "chunk_count": len(chunks)
    }
}


@app.get("/documents")
def get_documents_api():

    docs = []

    for filename in get_uploaded_documents():

        docs.append(
            {
                "filename": filename,
                "status": "ready",
                "chunk_count": get_document_chunk_count(filename),
                "upload_date": get_upload_date(filename)
            }
        )

    return {
    "success": True,
    "message": "Documents loaded.",
    "data": docs
    }


@app.get("/stats")
def get_stats():

    return {
        "success": True,
        "message": "Statistics loaded.",
        "data": {
            "documents": get_document_count(),
            "chunks": get_chunk_count()
        }
    }


@app.delete("/documents/{filename}")
def remove_document(filename: str):

    delete_uploaded_document(filename)

    delete_document(filename)
    remove_document(filename)

    return {
        "success": True,
        "message": "Document deleted successfully.",
        "data": None
    }