


# ============================================================
# STANDARD LIBRARY
# ============================================================

import os
import re
import shutil
import time

from typing import Optional


# ============================================================
# ENVIRONMENT
# ============================================================

from dotenv import load_dotenv


# Load backend/.env before OCR configuration is accessed.
load_dotenv()


# ============================================================
# FASTAPI
# ============================================================

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Depends,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import StreamingResponse


# ============================================================
# PYDANTIC
# ============================================================

from pydantic import BaseModel


# ============================================================
# SQLALCHEMY
# ============================================================

from sqlalchemy.orm import Session


# ============================================================
# AUTHENTICATION
# ============================================================

from routes.auth import router as auth_router

from auth.jwt_handler import (
    get_current_user,
)


# ============================================================
# DATABASE
# ============================================================

from database.database import (
    get_db,
    engine,
    Base,
)

from database.models import (
    User,
    Document,
)

# Ensure SQLAlchemy models are registered.
import database.models


# ============================================================
# DOCUMENT EXTRACTION
# ============================================================

from services.pdf_utils import (
    extract_text_from_pdf,
)


# ============================================================
# TEXT CHUNKING
# ============================================================

from services.chunking import (
    chunk_text,
)


# ============================================================
# EMBEDDINGS
# ============================================================

from services.embedding import (
    generate_embeddings,
    generate_query_embedding,
)


# ============================================================
# VECTOR STORE / CHROMADB
# ============================================================

from services.vector_store import (
    store_chunks,
    search_chunks,
    delete_pdf_embeddings,
)


# ============================================================
# GEMINI / AI SERVICE
# ============================================================

from services.gemini_service import (
    generate_answer,
    stream_answer,
    generate_quiz_from_context,
    generate_summary_from_context,
    generate_notes_from_context,
    generate_flashcards_from_context,
)


# ============================================================
# APPLICATION CONFIGURATION
# ============================================================

APP_NAME = "StudySphere AI"

APP_VERSION = "1.0.0"

BACKEND_HOST = "127.0.0.1"

BACKEND_PORT = 8000


# ============================================================
# SUPPORTED FILE TYPES
# ============================================================

# StudySphere intentionally supports PDF documents only.
SUPPORTED_PDF_EXTENSIONS = {
    ".pdf",
}

SUPPORTED_EXTENSIONS = (
    SUPPORTED_PDF_EXTENSIONS
)


# ============================================================
# UPLOAD CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads",
)


os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True,
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title=APP_NAME,
    description=(
        "AI-powered academic study assistant with "
        "PDF ingestion, OCR, RAG, ChromaDB and "
        "Gemini-powered study tools."
    ),
    version=APP_VERSION,
)


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# AUTH ROUTES
# ============================================================

app.include_router(
    auth_router
)


# ============================================================
# CORS
# ============================================================

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "X-StudySphere-Sources",
    ],
)


# ============================================================
# STARTUP LOG
# ============================================================

print()

print("=" * 72)
print("STUDYSPHERE AI BACKEND")
print("=" * 72)

print(
    f"Application : {APP_NAME}"
)

print(
    f"Version     : {APP_VERSION}"
)

print(
    "Environment : LOCAL"
)

print(
    f"Backend     : "
    f"http://{BACKEND_HOST}:{BACKEND_PORT}"
)

print()

print(
    "Supported documents:"
)

for extension in sorted(
    SUPPORTED_EXTENSIONS
):
    print(
        f"  ✓ {extension}"
    )

print()

print(
    "Frontend origins:"
)

for origin in ALLOWED_ORIGINS:
    print(
        f"  ✓ {origin}"
    )

print()

print(
    "AI Features:"
)

print(
    "  ✓ RAG Chat"
)

print(
    "  ✓ Summary"
)

print(
    "  ✓ Notes"
)

print(
    "  ✓ Quiz"
)

print(
    "  ✓ Flashcards"
)

print()

print(
    "Visual diagram generation: DISABLED"
)

print("=" * 72)
print()


# ============================================================
# REQUEST MODELS
# ============================================================


class QuestionRequest(
    BaseModel
):
    question: str


class QuizRequest(
    BaseModel
):
    topic: str = ""
    difficulty: str = "medium"
    questions: int = 10


class SummaryRequest(
    BaseModel
):
    topic: str = ""


class NotesRequest(
    BaseModel
):
    topic: str = ""


class FlashcardRequest(
    BaseModel
):
    topic: str = ""


# ============================================================
# FILE TYPE HELPERS
# ============================================================


def get_file_extension(
    filename: str,
) -> str:
    """
    Return the lowercase file extension.
    """

    if not filename:
        return ""

    return os.path.splitext(
        filename
    )[1].lower()


def is_pdf_file(
    filename: str,
) -> bool:
    """
    Return True when the filename is a supported PDF.
    """

    return (
        get_file_extension(filename)
        in SUPPORTED_PDF_EXTENSIONS
    )


def is_supported_file(
    filename: str,
) -> bool:
    """
    Return True when the uploaded file is supported.
    """

    extension = get_file_extension(
        filename
    )

    return (
        extension
        in SUPPORTED_EXTENSIONS
    )


# ============================================================
# DOCUMENT TYPE
# ============================================================


def get_document_type(
    filename: str,
) -> str:
    """
    Return the normalized document type.
    """

    if is_pdf_file(
        filename
    ):
        return "pdf"

    return "unknown"


# ============================================================
# SAVE UPLOADED FILE
# ============================================================


async def save_uploaded_file(
    file: UploadFile,
    current_user: User,
) -> tuple[str, str]:
    """
    Save the uploaded PDF inside the authenticated user's
    private upload directory.

    Returns:
        (
            original_filename,
            absolute_file_path
        )
    """

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )


    original_filename = (
        os.path.basename(
            file.filename
        ).strip()
    )


    if not original_filename:

        raise HTTPException(
            status_code=400,
            detail="Invalid filename.",
        )


    if not is_supported_file(
        original_filename
    ):

        supported = ", ".join(
            sorted(
                SUPPORTED_EXTENSIONS
            )
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                f"Supported formats: {supported}"
            ),
        )


    user_folder = os.path.join(
        UPLOAD_FOLDER,
        f"user_{current_user.id}",
    )


    os.makedirs(
        user_folder,
        exist_ok=True,
    )


    file_path = os.path.join(
        user_folder,
        original_filename,
    )


    try:

        with open(
            file_path,
            "wb",
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )

    except Exception as error:

        print(
            "[UPLOAD] File save failed:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to save the uploaded file."
            ),
        ) from error


    return (
        original_filename,
        file_path,
    )


# ============================================================
# DIRECT SCANNED-PDF OCR FALLBACK
# ============================================================

def _configure_tesseract() -> bool:
    """
    Configure Tesseract for Windows.

    pdf_utils.py remains the primary extraction layer.

    This fallback is used only when the primary PDF extraction
    does not produce enough readable text.

    Supports:
        - scanned PDFs
        - handwritten PDFs
        - image-based PDF pages

    No standalone image upload is introduced.
    """

    try:

        import pytesseract

    except ImportError:

        print(
            "[OCR FALLBACK] "
            "pytesseract is not installed."
        )

        return False


    configured_path = (
        os.getenv(
            "TESSERACT_CMD",
            "",
        )
        or
        os.getenv(
            "TESSERACT_PATH",
            "",
        )
    ).strip()


    candidate_paths = []


    if configured_path:

        candidate_paths.append(
            configured_path
        )


    candidate_paths.extend(
        [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        ]
    )


    try:

        path_from_system = (
            shutil.which(
                "tesseract"
            )
        )

        if path_from_system:

            candidate_paths.append(
                path_from_system
            )

    except Exception:

        pass


    seen = set()


    for candidate in candidate_paths:

        if not candidate:
            continue


        candidate = os.path.abspath(
            candidate
        )


        candidate_key = (
            candidate.lower()
        )


        if candidate_key in seen:
            continue


        seen.add(
            candidate_key
        )


        if not os.path.isfile(
            candidate
        ):
            continue


        try:

            pytesseract.pytesseract.tesseract_cmd = (
                candidate
            )

            version = (
                pytesseract.get_tesseract_version()
            )


            print(
                "[OCR FALLBACK] "
                "Tesseract configured: "
                f"{candidate}"
            )

            print(
                "[OCR FALLBACK] "
                f"Tesseract version: {version}"
            )


            return True


        except Exception as error:

            print(
                "[OCR FALLBACK] "
                "Tesseract candidate failed:",
                candidate,
                repr(error),
            )


    print(
        "[OCR FALLBACK] "
        "Tesseract executable was not found."
    )

    return False


# ============================================================
# DIRECT OCR EXTRACTION
# ============================================================


def _extract_text_with_direct_ocr(
    file_path: str,
) -> str:
    """
    Render every PDF page with PyMuPDF and OCR it with Tesseract.

    This is a PDF-only fallback.

    Every page receives a [Page N] marker so that the existing:

        chunking
            ↓
        embedding
            ↓
        ChromaDB

    pipeline can preserve page information.
    """

    print()

    print("=" * 72)
    print("DIRECT SCANNED-PDF OCR FALLBACK")
    print("=" * 72)


    if not os.path.isfile(
        file_path
    ):

        print(
            "[OCR FALLBACK] "
            "PDF file does not exist:",
            file_path,
        )

        return ""


    try:

        import fitz

    except ImportError as error:

        print(
            "[OCR FALLBACK] "
            "PyMuPDF is not installed:",
            repr(error),
        )

        return ""


    if not _configure_tesseract():

        return ""


    try:

        import pytesseract

        from PIL import Image

        from io import BytesIO

    except ImportError as error:

        print(
            "[OCR FALLBACK] "
            "OCR dependencies are missing:",
            repr(error),
        )

        print(
            "[OCR FALLBACK] "
            "Install with: "
            "pip install pytesseract pillow"
        )

        return ""


    ocr_psm = (
        os.getenv(
            "TESSERACT_PSM",
            "6",
        ).strip()
        or "6"
    )


    ocr_language = (
        os.getenv(
            "TESSERACT_LANG",
            "eng",
        ).strip()
        or "eng"
    )


    try:

        document = fitz.open(
            file_path
        )

    except Exception as error:

        print(
            "[OCR FALLBACK] "
            "Unable to open PDF:",
            repr(error),
        )

        return ""


    print(
        f"[OCR FALLBACK] "
        f"PDF pages: {len(document)}"
    )


    page_texts = []

    pages_with_text = 0

    total_characters = 0


    try:

        for page_index in range(
            len(document)
        ):

            page_number = (
                page_index + 1
            )


            try:

                page = document.load_page(
                    page_index
                )


                pixmap = page.get_pixmap(
                    matrix=fitz.Matrix(
                        2.0,
                        2.0,
                    ),
                    alpha=False,
                )


                image = Image.open(
                    BytesIO(
                        pixmap.tobytes(
                            "png"
                        )
                    )
                )


                image.load()


                try:

                    page_text = (
                        pytesseract.image_to_string(
                            image,
                            lang=ocr_language,
                            config=f"--psm {ocr_psm}",
                        )
                    )


                except Exception:

                    print(
                        f"[OCR FALLBACK] "
                        f"Page {page_number}: "
                        "configured language failed; "
                        "retrying with eng."
                    )


                    page_text = (
                        pytesseract.image_to_string(
                            image,
                            config=f"--psm {ocr_psm}",
                        )
                    )


                page_text = (
                    page_text or ""
                ).replace(
                    "\x00",
                    "",
                ).strip()


                if page_text:

                    pages_with_text += 1

                    total_characters += (
                        len(page_text)
                    )


                    page_texts.append(
                        f"[Page {page_number}]\n"
                        f"{page_text}"
                    )


                    print(
                        f"[OCR FALLBACK] "
                        f"Page {page_number}: "
                        f"{len(page_text)} chars"
                    )


                else:

                    print(
                        f"[OCR FALLBACK] "
                        f"Page {page_number}: "
                        "no readable text"
                    )


            except Exception as page_error:

                print(
                    f"[OCR FALLBACK] "
                    f"Page {page_number} failed:",
                    repr(page_error),
                )


    finally:

        try:

            document.close()

        except Exception:

            pass


    extracted_text = (
        "\n\n".join(
            page_texts
        ).strip()
    )


    print(
        "[OCR FALLBACK] "
        f"Pages with text: {pages_with_text}"
    )


    print(
        "[OCR FALLBACK] "
        f"Total OCR characters: {total_characters}"
    )


    print("=" * 72)


    return extracted_text


# ============================================================
# OCR FALLBACK DECISION
# ============================================================


def _needs_ocr_fallback(
    extracted_text: str,
) -> bool:
    """
    Decide whether primary PDF extraction produced enough text.

    OCR is activated only when:
        - no text exists, or
        - less than 500 readable characters exist.
    """

    text = (
        extracted_text or ""
    ).strip()


    if not text:

        return True


    without_markers = re.sub(
        r"\[Page\s+\d+\]",
        " ",
        text,
        flags=re.IGNORECASE,
    )


    readable_characters = len(
        re.sub(
            r"\s+",
            "",
            without_markers,
        )
    )


    return (
        readable_characters < 500
    )


# ============================================================
# EXTRACT DOCUMENT TEXT
# ============================================================


def extract_document_text(
    file_path: str,
    filename: str,
) -> str:
    """
    Extract readable text from an uploaded PDF.

    PRIMARY:
        PDF -> pdf_utils.py

    FALLBACK:
        PDF -> PyMuPDF -> Tesseract OCR

    Locked ingestion order after extraction:

        Extracted Text
             ↓
        chunking.py
             ↓
        embedding.py
             ↓
        vector_store.py
             ↓
        ChromaDB
    """

    document_type = (
        get_document_type(
            filename
        )
    )


    if document_type != "pdf":

        raise ValueError(
            "Only PDF documents are supported."
        )


    print(
        "[INGESTION] "
        "Extraction mode: PDF"
    )


    # ========================================================
    # STEP A — PRIMARY PDF EXTRACTION
    # ========================================================

    try:

        extracted_text = (
            extract_text_from_pdf(
                file_path
            )
            or ""
        ).strip()


    except Exception as error:

        print(
            "[EXTRACTION] "
            "Primary PDF extraction failed:",
            repr(error),
        )

        extracted_text = ""


    print(
        "[EXTRACTION] "
        "Primary extracted characters: "
        f"{len(extracted_text)}"
    )


    # ========================================================
    # STEP B — OCR FALLBACK
    # ========================================================

    if _needs_ocr_fallback(
        extracted_text
    ):

        print(
            "[EXTRACTION] "
            "Primary extraction is insufficient."
        )

        print(
            "[EXTRACTION] "
            "Activating direct scanned-PDF OCR fallback..."
        )


        ocr_text = (
            _extract_text_with_direct_ocr(
                file_path
            )
            or ""
        ).strip()


        if len(ocr_text) > len(
            extracted_text
        ):

            extracted_text = (
                ocr_text
            )


            print(
                "[EXTRACTION] "
                "OCR fallback selected: "
                f"{len(extracted_text)} characters"
            )


        else:

            print(
                "[EXTRACTION] "
                "OCR fallback did not produce more "
                "usable text."
            )


    # ========================================================
    # FINAL EXTRACTION
    # ========================================================

    return extracted_text.strip()


# ============================================================
# DOCUMENT DATABASE RECORD
# ============================================================


def create_or_update_document_record(
    db: Session,
    current_user: User,
    filename: str,
    file_path: str,
) -> Document:
    """
    Create a new document record or update the existing
    record for the same user + filename.
    """

    existing_document = (
        db.query(
            Document
        )
        .filter(
            Document.user_id
            == current_user.id,
            Document.filename
            == filename,
        )
        .first()
    )


    if existing_document:

        existing_document.filepath = (
            file_path
        )

        document = (
            existing_document
        )

        print(
            "[DATABASE] "
            "Existing document record updated."
        )


    else:

        document = Document(
            filename=filename,
            filepath=file_path,
            user_id=current_user.id,
        )

        db.add(
            document
        )

        print(
            "[DATABASE] "
            "New document record created."
        )


    try:

        db.commit()

        db.refresh(
            document
        )


    except Exception as error:

        db.rollback()

        print(
            "[DATABASE] "
            "Document record failed:",
            repr(error),
        )

        raise RuntimeError(
            "Unable to save document information."
        ) from error


    return document


# ============================================================
# RAG INDEXING PIPELINE
# ============================================================


def index_document(
    *,
    user_id: int,
    filename: str,
    file_path: str,
) -> dict:
    """
    Complete document ingestion pipeline.

    STRICT ORDER:

        1. Extract
        2. Chunk
        3. Embed
        4. Store in ChromaDB

    No Gemini generation happens during upload.
    """

    pipeline_start = (
        time.perf_counter()
    )


    # ========================================================
    # STEP 1 — EXTRACTION
    # ========================================================

    print()

    print("=" * 72)
    print("DOCUMENT INGESTION — STEP 1")
    print("=" * 72)

    print(
        f"[1/4] "
        f"Extracting text from: {filename}"
    )


    extraction_start = (
        time.perf_counter()
    )


    extracted_text = (
        extract_document_text(
            file_path=file_path,
            filename=filename,
        )
    )


    extraction_time = (
        time.perf_counter()
        - extraction_start
    )


    if not extracted_text:

        raise ValueError(
            "No readable text could be extracted "
            "from the document."
        )


    if len(extracted_text) < 20:

        raise ValueError(
            "The document does not contain enough "
            "readable text."
        )


    print(
        "[1/4] "
        "Extracted characters: "
        f"{len(extracted_text)}"
    )


    print(
        "[1/4] "
        f"Extraction time: {extraction_time:.2f}s"
    )


    # ========================================================
    # STEP 2 — CHUNKING
    # ========================================================

    print()

    print("=" * 72)
    print("DOCUMENT INGESTION — STEP 2")
    print("=" * 72)

    print(
        "[2/4] "
        "Creating semantic text chunks..."
    )


    chunk_start = (
        time.perf_counter()
    )


    chunks = chunk_text(
        extracted_text
    )


    chunks = [
        str(chunk).strip()
        for chunk in chunks
        if chunk is not None
        and str(chunk).strip()
    ]


    chunk_time = (
        time.perf_counter()
        - chunk_start
    )


    if not chunks:

        raise ValueError(
            "Unable to create text chunks."
        )


    print(
        "[2/4] "
        f"Chunks created: {len(chunks)}"
    )


    print(
        "[2/4] "
        f"Chunking time: {chunk_time:.2f}s"
    )


    # ========================================================
    # STEP 3 — EMBEDDINGS
    # ========================================================

    print()

    print("=" * 72)
    print("DOCUMENT INGESTION — STEP 3")
    print("=" * 72)

    print(
        "[3/4] "
        "Generating embeddings..."
    )


    embedding_start = (
        time.perf_counter()
    )


    embeddings = (
        generate_embeddings(
            chunks
        )
    )


    embedding_time = (
        time.perf_counter()
        - embedding_start
    )


    if embeddings is None:

        raise ValueError(
            "Embedding generation returned None."
        )


    if len(embeddings) == 0:

        raise ValueError(
            "No embeddings were generated."
        )


    if len(embeddings) != len(
        chunks
    ):

        raise ValueError(
            "Embedding count does not match "
            "chunk count."
        )


    embedding_dimension = len(
        embeddings[0]
    )


    print(
        "[3/4] "
        f"Embeddings generated: {len(embeddings)}"
    )


    print(
        "[3/4] "
        f"Embedding dimension: {embedding_dimension}"
    )


    print(
        "[3/4] "
        f"Embedding time: {embedding_time:.2f}s"
    )


    # ========================================================
    # STEP 4 — CHROMADB
    # ========================================================

    print()

    print("=" * 72)
    print("DOCUMENT INGESTION — STEP 4")
    print("=" * 72)

    print(
        "[4/4] "
        "Storing vectors in ChromaDB..."
    )


    vector_start = (
        time.perf_counter()
    )


    stored_count = store_chunks(
        user_id=user_id,
        filename=filename,
        chunks=chunks,
        embeddings=embeddings,
    )


    vector_time = (
        time.perf_counter()
        - vector_start
    )


    if stored_count != len(
        chunks
    ):

        raise ValueError(
            "Not all chunks were stored in ChromaDB. "
            f"Expected {len(chunks)}, "
            f"stored {stored_count}."
        )


    # ========================================================
    # COMPLETE
    # ========================================================

    total_time = (
        time.perf_counter()
        - pipeline_start
    )


    print()

    print("=" * 72)
    print("DOCUMENT INGESTION COMPLETED")
    print("=" * 72)


    print(
        f"File              : {filename}"
    )

    print(
        f"Characters        : {len(extracted_text)}"
    )

    print(
        f"Chunks            : {len(chunks)}"
    )

    print(
        f"Embeddings        : {len(embeddings)}"
    )

    print(
        f"Embedding size    : {embedding_dimension}"
    )

    print(
        f"Stored in Chroma  : {stored_count}"
    )

    print(
        f"Total time        : {total_time:.2f}s"
    )

    print("=" * 72)


    return {
        "characters": len(
            extracted_text
        ),
        "total_chunks": len(
            chunks
        ),
        "stored_chunks": stored_count,
        "embedding_dimension": (
            embedding_dimension
        ),
        "extraction_time": round(
            extraction_time,
            2,
        ),
        "chunking_time": round(
            chunk_time,
            2,
        ),
        "embedding_time": round(
            embedding_time,
            2,
        ),
        "vector_store_time": round(
            vector_time,
            2,
        ),
        "processing_time": round(
            total_time,
            2,
        ),
    }


# ============================================================
# HOME
# ============================================================


@app.get("/")
def home():

    return {
        "success": True,
        "message": (
            "StudySphere AI Backend Running 🚀"
        ),
        "environment": "local",
        "version": APP_VERSION,
    }


# ============================================================
# HEALTH CHECK
# ============================================================


@app.get("/health")
def health_check():

    return {
        "success": True,
        "status": "healthy",
        "service": APP_NAME,
        "version": APP_VERSION,
    }


# ============================================================
# UPLOAD DOCUMENT
# ============================================================


@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):
    """
    Upload and index a study PDF.

    STRICT PIPELINE:

        Upload
          ↓
        PDF extraction / OCR
          ↓
        Text
          ↓
        Chunking
          ↓
        Embeddings
          ↓
        ChromaDB
    """

    upload_start = (
        time.perf_counter()
    )


    print()

    print("=" * 72)
    print("STUDYSPHERE DOCUMENT UPLOAD")
    print("=" * 72)


    # ========================================================
    # VALIDATE FILE
    # ========================================================

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )


    filename = (
        os.path.basename(
            file.filename
        ).strip()
    )


    if not filename:

        raise HTTPException(
            status_code=400,
            detail="Invalid filename.",
        )


    if not is_supported_file(
        filename
    ):

        supported = ", ".join(
            sorted(
                SUPPORTED_EXTENSIONS
            )
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                f"Supported formats: {supported}"
            ),
        )


    document_type = (
        get_document_type(
            filename
        )
    )


    print(
        f"[UPLOAD] User ID : {current_user.id}"
    )

    print(
        f"[UPLOAD] File    : {filename}"
    )

    print(
        f"[UPLOAD] Type    : {document_type}"
    )


    # ========================================================
    # SAVE FILE
    # ========================================================

    try:

        (
            saved_filename,
            file_path,
        ) = await save_uploaded_file(
            file=file,
            current_user=current_user,
        )


        print(
            f"[UPLOAD] Saved: {file_path}"
        )


    except HTTPException:

        raise


    except Exception as error:

        print(
            "[UPLOAD] Save error:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to save the uploaded document."
            ),
        ) from error


    # ========================================================
    # DATABASE RECORD
    # ========================================================

    try:

        document = (
            create_or_update_document_record(
                db=db,
                current_user=current_user,
                filename=saved_filename,
                file_path=file_path,
            )
        )


    except Exception as error:

        try:

            if os.path.exists(
                file_path
            ):

                os.remove(
                    file_path
                )

        except Exception:

            pass


        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


    # ========================================================
    # RAG INGESTION
    # ========================================================

    try:

        stats = index_document(
            user_id=current_user.id,
            filename=saved_filename,
            file_path=file_path,
        )


    except Exception as error:

        print()

        print("=" * 72)
        print("DOCUMENT INGESTION FAILED")
        print("=" * 72)


        print(
            "[INGESTION ERROR]",
            repr(error),
        )


        print("=" * 72)


        # ----------------------------------------------------
        # Remove physical file
        # ----------------------------------------------------

        try:

            if os.path.exists(
                file_path
            ):

                os.remove(
                    file_path
                )

        except Exception as cleanup_error:

            print(
                "[CLEANUP] "
                "File removal failed:",
                repr(cleanup_error),
            )


        # ----------------------------------------------------
        # Remove database record
        # ----------------------------------------------------

        try:

            db.delete(
                document
            )

            db.commit()


        except Exception as cleanup_error:

            db.rollback()

            print(
                "[CLEANUP] "
                "Database rollback failed:",
                repr(cleanup_error),
            )


        raise HTTPException(
            status_code=500,
            detail=(
                "Document processing failed. "
                f"{str(error)}"
            ),
        ) from error


    # ========================================================
    # RESPONSE
    # ========================================================

    total_upload_time = (
        time.perf_counter()
        - upload_start
    )


    print()

    print("=" * 72)
    print("DOCUMENT UPLOAD SUCCESSFUL")
    print("=" * 72)


    print(
        f"[UPLOAD] File: {saved_filename}"
    )

    print(
        "[UPLOAD] Total time: "
        f"{total_upload_time:.2f}s"
    )


    print("=" * 72)


    return {
        "success": True,
        "message": (
            "Document uploaded and indexed successfully."
        ),
        "document": {
            "id": document.id,
            "filename": saved_filename,
            "type": document_type,
        },
        "indexing": stats,
    }


# ============================================================
# GET UPLOADED FILES
# ============================================================


@app.get("/files")
def get_uploaded_files(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    documents = (
        db.query(
            Document
        )
        .filter(
            Document.user_id
            == current_user.id
        )
        .order_by(
            Document.uploaded_at.desc()
        )
        .all()
    )


    files = []


    for document in documents:

        size = 0


        if os.path.exists(
            document.filepath
        ):

            try:

                size = os.path.getsize(
                    document.filepath
                )

            except Exception:

                size = 0


        files.append(
            {
                "id": document.id,
                "filename": document.filename,
                "size": size,
                "uploaded_at": (
                    document.uploaded_at
                ),
            }
        )


    return {
        "success": True,
        "files": files,
        "total": len(files),
    }


# ============================================================
# BUILD AI CONTEXT
# ============================================================


def build_ai_context(
    user_id: int,
    search_text: str,
    n_results: int = 10,
):
    """
    Shared RAG retrieval layer.

    Used by:

        Chat
        Summary
        Notes
        Quiz
        Flashcards

    Pipeline:

        User request
             ↓
        Query embedding
             ↓
        ChromaDB search
             ↓
        Relevant chunks
             ↓
        Context
    """

    context_start = (
        time.perf_counter()
    )


    query = (
        search_text or ""
    ).strip()


    if not query:

        query = (
            "important concepts definitions "
            "key topics explanations examples "
            "formulas facts from the uploaded "
            "study material"
        )


    print()

    print(
        f"[RAG] Query: {query}"
    )


    # ========================================================
    # QUERY EMBEDDING
    # ========================================================

    embedding = (
        generate_query_embedding(
            query
        )
    )


    # ========================================================
    # CHROMADB VECTOR SEARCH
    # ========================================================

    results = search_chunks(
        user_id=user_id,
        question_embedding=embedding,
        n_results=n_results,
    )


    # ========================================================
    # SAFE RESULT EXTRACTION
    # ========================================================

    documents = []

    metadatas = []

    distances = []


    if results:

        raw_documents = (
            results.get(
                "documents"
            )
        )

        raw_metadatas = (
            results.get(
                "metadatas"
            )
        )

        raw_distances = (
            results.get(
                "distances"
            )
        )


        if raw_documents:

            documents = (
                raw_documents[0]
                or []
            )


        if raw_metadatas:

            metadatas = (
                raw_metadatas[0]
                or []
            )


        if raw_distances:

            distances = (
                raw_distances[0]
                or []
            )


    print(
        "[RAG] Retrieved chunks: "
        f"{len(documents)}"
    )


    # ========================================================
    # CONTEXT LIMITS
    # ========================================================

    MAX_CHUNK_LENGTH = 5000

    MAX_CONTEXT_LENGTH = 30000


    # ========================================================
    # BUILD CONTEXT
    # ========================================================

    context_parts = []

    sources = []

    seen_chunks = set()

    current_context_length = 0


    for index, document in enumerate(
        documents
    ):

        if not document:
            continue


        document = str(
            document
        ).strip()


        if not document:
            continue


        normalized = (
            document.lower()
            .strip()
        )


        if normalized in seen_chunks:

            continue


        seen_chunks.add(
            normalized
        )


        # ----------------------------------------------------
        # Individual chunk limit
        # ----------------------------------------------------

        if len(document) > (
            MAX_CHUNK_LENGTH
        ):

            document = (
                document[
                    :MAX_CHUNK_LENGTH
                ].rstrip()
                + "..."
            )


        # ----------------------------------------------------
        # Metadata
        # ----------------------------------------------------

        metadata = {}


        if index < len(
            metadatas
        ):

            metadata = (
                metadatas[index]
                or {}
            )


        filename = metadata.get(
            "filename",
            "Unknown document",
        )


        # ----------------------------------------------------
        # Distance
        # ----------------------------------------------------

        distance: Optional[
            float
        ] = None


        if index < len(
            distances
        ):

            distance = (
                distances[index]
            )


        # ----------------------------------------------------
        # Context block
        # ----------------------------------------------------

        context_block = (
            f"[Source: {filename}]\n"
            f"{document}"
        )


        block_length = len(
            context_block
        )


        if (
            current_context_length
            + block_length
            > MAX_CONTEXT_LENGTH
        ):

            break


        context_parts.append(
            context_block
        )


        current_context_length += (
            block_length
        )


        if filename not in sources:

            sources.append(
                filename
            )


        print(
            f"[RAG] Chunk {index + 1}: "
            f"{filename} | "
            f"distance={distance}"
        )


    # ========================================================
    # FINAL CONTEXT
    # ========================================================

    context = (
        "\n\n---\n\n".join(
            context_parts
        ).strip()
    )


    total_time = (
        time.perf_counter()
        - context_start
    )


    print(
        "[RAG] Context length: "
        f"{len(context)} characters"
    )


    print(
        "[RAG] Sources: "
        f"{len(sources)}"
    )


    print(
        "[RAG] Retrieval time: "
        f"{total_time:.2f}s"
    )


    return (
        context,
        sources,
    )


# ============================================================
# DELETE DOCUMENT
# ============================================================


@app.delete(
    "/delete-file/{filename}"
)
def delete_uploaded_file(
    filename: str,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    filename = (
        os.path.basename(
            filename
        ).strip()
    )


    if not filename:

        raise HTTPException(
            status_code=400,
            detail="Invalid filename.",
        )


    document = (
        db.query(
            Document
        )
        .filter(
            Document.user_id
            == current_user.id,
            Document.filename
            == filename,
        )
        .first()
    )


    if not document:

        return {
            "success": False,
            "message": "File not found.",
        }


    # ========================================================
    # DELETE VECTOR DATA FIRST
    # ========================================================

    try:

        deleted_chunks = (
            delete_pdf_embeddings(
                user_id=current_user.id,
                filename=filename,
            )
        )


    except Exception as error:

        print(
            "[DELETE] "
            "ChromaDB deletion failed:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to delete document vectors."
            ),
        ) from error


    # ========================================================
    # DELETE PHYSICAL FILE
    # ========================================================

    try:

        if os.path.exists(
            document.filepath
        ):

            os.remove(
                document.filepath
            )


    except Exception as error:

        print(
            "[DELETE] "
            "Physical file deletion failed:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to delete document file."
            ),
        ) from error


    # ========================================================
    # DELETE DATABASE RECORD
    # ========================================================

    try:

        db.delete(
            document
        )

        db.commit()


    except Exception as error:

        db.rollback()

        print(
            "[DELETE] "
            "Database deletion failed:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to delete document record."
            ),
        ) from error


    return {
        "success": True,
        "message": (
            "Document deleted successfully."
        ),
        "filename": filename,
        "deleted_chunks": deleted_chunks,
    }


# ============================================================
# GENERATE QUIZ
# ============================================================


@app.post(
    "/generate-quiz"
)
def generate_quiz(
    request: QuizRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    total_documents = (
        db.query(
            Document
        )
        .filter(
            Document.user_id
            == current_user.id
        )
        .count()
    )


    if total_documents == 0:

        return {
            "success": False,
            "message": (
                "No study material found. "
                "Please upload a document first."
            ),
            "quiz": [],
            "sources": [],
        }


    try:

        topic = (
            request.topic or ""
        ).strip()


        difficulty = (
            request.difficulty
            or "medium"
        ).strip()


        try:

            question_count = max(
                5,
                min(
                    int(
                        request.questions
                        or 10
                    ),
                    25,
                ),
            )

        except (
            TypeError,
            ValueError,
        ):

            question_count = 10


        # ====================================================
        # RAG
        # ====================================================

        context, sources = (
            build_ai_context(
                user_id=current_user.id,
                search_text=topic,
                n_results=12,
            )
        )


        if not context:

            return {
                "success": False,
                "message": (
                    "No relevant study material "
                    "was found for this quiz."
                ),
                "quiz": [],
                "sources": [],
            }


        # ====================================================
        # GEMINI QUIZ
        # ====================================================

        quiz = (
            generate_quiz_from_context(
                context=context,
                difficulty=difficulty,
                num_questions=question_count,
            )
        )


        if not isinstance(
            quiz,
            list,
        ):

            quiz = []


        # ====================================================
        # VALIDATE AI OUTPUT
        # ====================================================

        valid_quiz = []


        for question in quiz:

            if not isinstance(
                question,
                dict,
            ):

                continue


            question_text = str(
                question.get(
                    "question",
                    "",
                )
                or ""
            ).strip()


            options = question.get(
                "options",
                [],
            )


            answer = str(
                question.get(
                    "answer",
                    "",
                )
                or ""
            ).strip()


            explanation = str(
                question.get(
                    "explanation",
                    "",
                )
                or ""
            ).strip()


            if not question_text:

                continue


            if not isinstance(
                options,
                list,
            ):

                continue


            clean_options = [
                str(option).strip()
                for option in options
                if option is not None
                and str(option).strip()
            ]


            if len(clean_options) != 4:

                continue


            if len(
                set(clean_options)
            ) != 4:

                continue


            if not answer:

                continue


            if answer not in clean_options:

                continue


            question["question"] = (
                question_text
            )

            question["options"] = (
                clean_options
            )

            question["answer"] = (
                answer
            )

            question["explanation"] = (
                explanation
            )

            question["source"] = (
                ", ".join(sources)
            )


            valid_quiz.append(
                question
            )


        if not valid_quiz:

            return {
                "success": False,
                "message": (
                    "AI could not generate a "
                    "valid quiz. Please try again."
                ),
                "quiz": [],
                "sources": sources,
            }


        return {
            "success": True,
            "message": (
                "Quiz generated successfully."
            ),
            "quiz": valid_quiz,
            "sources": sources,
        }


    except Exception as error:

        print(
            "[QUIZ ERROR]",
            repr(error),
        )

        return {
            "success": False,
            "message": (
                "Quiz generation failed. "
                "Please try again."
            ),
            "quiz": [],
            "sources": [],
        }


# ============================================================
# GENERATE SUMMARY
# ============================================================


@app.post(
    "/generate-summary"
)
def generate_summary(
    request: SummaryRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    total_documents = (
        db.query(
            Document
        )
        .filter(
            Document.user_id
            == current_user.id
        )
        .count()
    )


    if total_documents == 0:

        return {
            "success": False,
            "message": (
                "No study material found. "
                "Please upload a document first."
            ),
            "summary": "",
            "sources": [],
        }


    try:

        topic = (
            request.topic or ""
        ).strip()


        context, sources = (
            build_ai_context(
                user_id=current_user.id,
                search_text=topic,
                n_results=20,
            )
        )


        if not context:

            return {
                "success": False,
                "message": (
                    "No usable study material found."
                ),
                "summary": "",
                "sources": [],
            }


        summary = (
            generate_summary_from_context(
                context
            )
        )


        if not summary:

            return {
                "success": False,
                "message": (
                    "Summary could not be generated. "
                    "Please try again."
                ),
                "summary": "",
                "sources": sources,
            }


        return {
            "success": True,
            "message": (
                "Summary generated successfully."
            ),
            "summary": summary,
            "sources": sources,
        }


    except Exception as error:

        print(
            "[SUMMARY ERROR]",
            repr(error),
        )

        return {
            "success": False,
            "message": (
                "Summary generation failed. "
                "Please try again."
            ),
            "summary": "",
            "sources": [],
        }


# ============================================================
# GENERATE NOTES
# ============================================================


@app.post(
    "/generate-notes"
)
def generate_notes(
    request: NotesRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    total_documents = (
        db.query(
            Document
        )
        .filter(
            Document.user_id
            == current_user.id
        )
        .count()
    )


    if total_documents == 0:

        return {
            "success": False,
            "message": (
                "No study material found. "
                "Please upload a document first."
            ),
            "notes": "",
            "sources": [],
        }


    try:

        topic = (
            request.topic or ""
        ).strip()


        # ====================================================
        # RAG RETRIEVAL
        # ====================================================

        context, sources = (
            build_ai_context(
                user_id=current_user.id,
                search_text=topic,
                n_results=20,
            )
        )


        if not context:

            return {
                "success": False,
                "message": (
                    "No usable study material found."
                ),
                "notes": "",
                "sources": [],
            }


        # ====================================================
        # GEMINI NOTES
        #
        # IMPORTANT:
        # Only ONE Gemini notes call.
        #
        # No diagram analysis.
        # No PDF page rendering.
        # ====================================================

        notes = (
            generate_notes_from_context(
                context
            )
        )


        if not notes:

            return {
                "success": False,
                "message": (
                    "Notes could not be generated. "
                    "Please try again."
                ),
                "notes": "",
                "sources": sources,
            }


        return {
            "success": True,
            "message": (
                "Notes generated successfully."
            ),
            "notes": notes,
            "sources": sources,
        }


    except Exception as error:

        print(
            "[NOTES ERROR]",
            repr(error),
        )

        return {
            "success": False,
            "message": (
                "Notes generation failed. "
                "Please try again."
            ),
            "notes": "",
            "sources": [],
        }


# ============================================================
# GENERATE FLASHCARDS
# ============================================================


@app.post(
    "/generate-flashcards"
)
def generate_flashcards(
    request: FlashcardRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):

    total_documents = (
        db.query(
            Document
        )
        .filter(
            Document.user_id
            == current_user.id
        )
        .count()
    )


    if total_documents == 0:

        return {
            "success": False,
            "message": (
                "No study material found. "
                "Please upload a document first."
            ),
            "flashcards": [],
            "sources": [],
        }


    try:

        topic = (
            request.topic or ""
        ).strip()


        context, sources = (
            build_ai_context(
                user_id=current_user.id,
                search_text=topic,
                n_results=20,
            )
        )


        if not context:

            return {
                "success": False,
                "message": (
                    "No usable study material found."
                ),
                "flashcards": [],
                "sources": [],
            }


        flashcards = (
            generate_flashcards_from_context(
                context
            )
        )


        if not isinstance(
            flashcards,
            list,
        ):

            flashcards = []


        if not flashcards:

            return {
                "success": False,
                "message": (
                    "AI could not generate flashcards. "
                    "Please try again."
                ),
                "flashcards": [],
                "sources": sources,
            }


        return {
            "success": True,
            "message": (
                "Flashcards generated successfully."
            ),
            "flashcards": flashcards,
            "sources": sources,
        }


    except Exception as error:

        print(
            "[FLASHCARD ERROR]",
            repr(error),
        )

        return {
            "success": False,
            "message": (
                "Flashcard generation failed. "
                "Please try again."
            ),
            "flashcards": [],
            "sources": [],
        }


# ============================================================
# ASK QUESTION — STREAMING RAG CHAT
# ============================================================


@app.post(
    "/ask"
)
def ask_question(
    request: QuestionRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_db
    ),
):
    """
    Streaming RAG chat.

    Flow:

        User Question
             ↓
        Query Embedding
             ↓
        ChromaDB Retrieval
             ↓
        Relevant Context
             ↓
        Gemini
             ↓
        Streaming Text Answer

    No diagram generation.
    No PDF page rendering.
    No image processing.
    """

    question = (
        request.question or ""
    ).strip()


    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )


    total_documents = (
        db.query(
            Document
        )
        .filter(
            Document.user_id
            == current_user.id
        )
        .count()
    )


    if total_documents == 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "No study material found. "
                "Please upload a document first."
            ),
        )


    print()

    print("=" * 72)
    print("STUDYSPHERE AI CHAT")
    print("=" * 72)


    print(
        f"[CHAT] User: {current_user.id}"
    )


    print(
        f"[CHAT] Question: {question}"
    )


    # ========================================================
    # RAG RETRIEVAL
    # ========================================================

    try:

        context, sources = (
            build_ai_context(
                user_id=current_user.id,
                search_text=question,
                n_results=12,
            )
        )


    except Exception as error:

        print(
            "[CHAT] "
            "RAG search failed:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to search your study material."
            ),
        ) from error


    if not context:

        raise HTTPException(
            status_code=404,
            detail=(
                "No relevant information was found "
                "in your uploaded study material."
            ),
        )


    print(
        "[CHAT] Context: "
        f"{len(context)} characters"
    )


    print(
        f"[CHAT] Sources: {sources}"
    )


    # ========================================================
    # STREAM GEMINI RESPONSE
    # ========================================================

    def generate_stream():

        try:

            for chunk in stream_answer(
                question,
                context,
            ):

                if chunk:

                    yield chunk


        except Exception as error:

            print(
                "[CHAT] Streaming error:",
                repr(error),
            )

            yield (
                "\n\n"
                "Something went wrong while "
                "generating the answer."
            )


    # ========================================================
    # STREAMING RESPONSE
    # ========================================================

    return StreamingResponse(
        generate_stream(),
        media_type=(
            "text/plain; charset=utf-8"
        ),
        headers={
            "X-StudySphere-Sources": (
                "||".join(
                    sources
                )
            ),
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )


# ============================================================
# END OF main.py
# ============================================================

print(
    "[StudySphere] main.py loaded successfully."
)

print(
    "[StudySphere] "
    "PDF → OCR → Chunking → Embedding → ChromaDB → Gemini"
)

print(
    "[StudySphere] "
    "Text-only AI mode active."
)