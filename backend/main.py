from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router

import os
import shutil
import time

from fastapi import Depends
from sqlalchemy.orm import Session

from auth.jwt_handler import get_current_user

from database.database import get_db
from database.models import (User,Document)

from database.database import engine
from database.database import Base

import database.models

from services.pdf_utils import extract_text_from_pdf

from services.chunking import chunk_text

from services.embedding import (
    generate_embeddings,
    generate_query_embedding,
)

from services.vector_store import (
    store_chunks,
    search_chunks,
    delete_pdf_embeddings,
)

from services.gemini_service import (
    generate_answer,
    generate_quiz_from_context,
    generate_summary_from_context,
    generate_notes_from_context,
    generate_flashcards_from_context,
)

# --------------------------------------------------
# FastAPI App
# --------------------------------------------------

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Configuration
# --------------------------------------------------

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --------------------------------------------------
# Request Models
# --------------------------------------------------

class QuestionRequest(BaseModel):
    question: str


class QuizRequest(BaseModel):
    topic: str
    difficulty: str
    questions: int
    
class SummaryRequest(BaseModel):
    topic: str = ""
    
class NotesRequest(BaseModel):
    topic: str = ""
    
class FlashcardRequest(BaseModel):
    topic: str = ""


# --------------------------------------------------
# Home API
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "StudySphere Backend Running 🚀"
    }


# --------------------------------------------------
# Upload PDF
# --------------------------------------------------

@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    print("Upload Started")

    # -----------------------------------------
    # Create user folder
    # -----------------------------------------

    user_folder = os.path.join(
        UPLOAD_FOLDER,
        f"user_{current_user.id}"
    )

    os.makedirs(user_folder, exist_ok=True)

    file_path = os.path.join(
        user_folder,
        file.filename
    )

    # -----------------------------------------
    # Save PDF
    # -----------------------------------------

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print("File Saved")

    # -----------------------------------------
    # Save document record
    # -----------------------------------------

    existing = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.filename == file.filename
    ).first()

    if existing:
        existing.filepath = file_path
    else:
        db.add(
            Document(
                filename=file.filename,
                filepath=file_path,
                user_id=current_user.id
            )
        )

    db.commit()

    # -----------------------------------------
    # AI Processing
    # -----------------------------------------

    start_time = time.time()

    extracted_text = extract_text_from_pdf(file_path)

    chunks = chunk_text(extracted_text)

    embeddings = generate_embeddings(chunks)

    store_chunks(
        current_user.id,
        file.filename,
        chunks,
        embeddings
    )

    end_time = time.time()

    print(f"Processing Time: {end_time-start_time:.2f} sec")

    return {
        "success": True,
        "filename": file.filename,
        "user_id": current_user.id,
        "characters": len(extracted_text),
        "total_chunks": len(chunks),
        "embedding_dimension": len(embeddings[0]),
        "stored": "Successfully Stored"
    }
    
    # --------------------------------------------------
# Get Uploaded Files
# --------------------------------------------------

@app.get("/files")
def get_uploaded_files(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    files = []

    for doc in documents:

        size = 0

        if os.path.exists(doc.filepath):
            size = os.path.getsize(doc.filepath)

        files.append({
            "id": doc.id,
            "filename": doc.filename,
            "size": size,
            "uploaded_at": doc.uploaded_at
        })

    return {
        "success": True,
        "files": files,
        "total": len(files)
    }


# --------------------------------------------------
# Build Quiz Context
# --------------------------------------------------

def build_quiz_context(user_id, search_text):

    query = search_text.strip()

    if query == "":
        query = "Complete uploaded study material"

    embedding = generate_query_embedding(query)

    results = search_chunks(
        user_id,
        embedding
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    seen = set()

    context = []
    sources = []

    for doc, meta in zip(documents, metadatas):

        if doc in seen:
            continue

        seen.add(doc)

        context.append(doc)

        filename = meta.get("filename", "Unknown")

        if filename not in sources:
            sources.append(filename)

    return "\n\n".join(context), sources


# --------------------------------------------------
# Delete Uploaded PDF
# --------------------------------------------------

@app.delete("/delete-file/{filename}")
def delete_uploaded_file(
    filename: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id,
            Document.filename == filename
        )
        .first()
    )

    if not document:
        return {
            "success": False,
            "message": "File not found."
        }

    try:

        if os.path.exists(document.filepath):
            os.remove(document.filepath)

    except Exception as e:

        return {
            "success": False,
            "message": f"Unable to delete file: {str(e)}"
        }

    deleted_chunks = delete_pdf_embeddings(
        current_user.id,
        filename
    )

    db.delete(document)
    db.commit()

    return {
        "success": True,
        "message": "PDF deleted successfully.",
        "deleted_chunks": deleted_chunks
    }


# --------------------------------------------------
# Generate Quiz API
# --------------------------------------------------

@app.post("/generate-quiz")
def generate_quiz(
    request: QuizRequest,
    current_user: User = Depends(get_current_user)
):

    context, sources = build_quiz_context(
        current_user.id,
        request.topic
    )

    quiz = generate_quiz_from_context(
        context=context,
        difficulty=request.difficulty,
        num_questions=request.questions,
    )

    for q in quiz:
        q["source"] = ", ".join(sources)

    return {
        "success": True,
        "quiz": quiz,
    }
    
# --------------------------------------------------
# Generate Summary API
# --------------------------------------------------

@app.post("/generate-summary")
def generate_summary(
    request: SummaryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # -----------------------------------------
    # Check Uploaded PDFs
    # -----------------------------------------

    total_documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .count()
    )

    if total_documents == 0:

        return {
            "success": False,
            "message": "No study material found. Please upload at least one PDF.",
            "summary": "",
            "sources": []
        }

    # -----------------------------------------
    # Build Context
    # -----------------------------------------

    context, sources = build_quiz_context(
        current_user.id,
        request.topic
    )

    if context.strip() == "":

        return {
            "success": False,
            "message": "No usable study material found.",
            "summary": "",
            "sources": []
        }

    # -----------------------------------------
    # Generate Summary
    # -----------------------------------------

    summary = generate_summary_from_context(
        context
    )

    return {
        "success": True,
        "message": "Summary generated successfully.",
        "summary": summary,
        "sources": sources
    }
    

@app.post("/generate-notes")
def generate_notes(
    request: NotesRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    total_documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .count()
    )

    if total_documents == 0:
        return {
            "success": False,
            "message": "No study material found.",
            "notes": "",
            "sources": []
        }

    context, sources = build_quiz_context(
        current_user.id,
        request.topic
    )

    notes = generate_notes_from_context(context)

    return {
        "success": True,
        "notes": notes,
        "sources": sources
    }
    
@app.post("/generate-flashcards")
def generate_flashcards(
    request: FlashcardRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    total_documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .count()
    )

    if total_documents == 0:
        return {
            "success": False,
            "message": "No study material found.",
            "flashcards": [],
            "sources": []
        }

    context, sources = build_quiz_context(
        current_user.id,
        request.topic
    )

    flashcards = generate_flashcards_from_context(context)

    return {
        "success": True,
        "flashcards": flashcards,
        "sources": sources
    }
    
# --------------------------------------------------
# Ask Question API
# --------------------------------------------------

@app.post("/ask")
def ask_question(
    request: QuestionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # -----------------------------------------
    # Check if user has uploaded any PDFs
    # -----------------------------------------

    total_documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .count()
    )

    if total_documents == 0:
        return {
            "success": False,
            "message": "No study material found. Please upload at least one PDF.",
            "answer": "",
            "sources": []
        }

    # -----------------------------------------
    # Generate Query Embedding
    # -----------------------------------------

    try:

        question_embedding = generate_query_embedding(
            request.question
        )

    except Exception as e:

        return {
            "success": False,
            "message": f"Embedding Error: {str(e)}",
            "answer": "",
            "sources": []
        }

    # -----------------------------------------
    # Search ChromaDB
    # -----------------------------------------

    try:

        results = search_chunks(
            current_user.id,
            question_embedding,
            n_results=10
        )

    except Exception as e:

        return {
            "success": False,
            "message": f"Vector Search Error: {str(e)}",
            "answer": "",
            "sources": []
        }

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    # -----------------------------------------
    # No Context Found
    # -----------------------------------------

    if not documents:

        return {
            "success": False,
            "message": "No relevant information was found in your uploaded PDFs.",
            "answer": "",
            "sources": []
        }

    # -----------------------------------------
    # Remove Duplicate Chunks
    # -----------------------------------------

    context_parts = []
    unique_sources = []
    seen_chunks = set()

    for document, metadata in zip(documents, metadatas):

        if not document:
            continue

        if document in seen_chunks:
            continue

        seen_chunks.add(document)

        context_parts.append(document)

        if metadata not in unique_sources:
            unique_sources.append(metadata)

    # -----------------------------------------
    # Empty Context Check
    # -----------------------------------------

    context = "\n\n".join(context_parts).strip()

    if context == "":

        return {
            "success": False,
            "message": "No usable study content was found in your uploaded PDFs.",
            "answer": "",
            "sources": []
        }

    # -----------------------------------------
    # Generate AI Answer
    # -----------------------------------------

    try:

        answer = generate_answer(
            request.question,
            context
        )

    except Exception as e:

        return {
            "success": False,
            "message": f"Gemini Error: {str(e)}",
            "answer": "",
            "sources": []
        }


    # -----------------------------------------
    # Success Response
    # -----------------------------------------

    return {
        "success": True,
        "message": "Answer generated successfully.",
        "question": request.question,
        "answer": answer,
        "sources": unique_sources
    }
        
