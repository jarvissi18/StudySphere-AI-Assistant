
import logging
import os
import re
from typing import Optional, Tuple, List

from dotenv import load_dotenv
from pypdf import PdfReader

load_dotenv()


# ============================================================
# OPTIONAL OCR DEPENDENCIES
# ============================================================

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    from PIL import Image, ImageEnhance, ImageFilter, ImageOps
except ImportError:
    Image = None
    ImageEnhance = None
    ImageFilter = None
    ImageOps = None

try:
    import pytesseract
except ImportError:
    pytesseract = None


# ============================================================
# LOGGER
# ============================================================

logger = logging.getLogger("studysphere.pdf_utils")


# ============================================================
# CONFIGURATION
# ============================================================

OCR_ENABLED = (
    os.getenv("STUDYSPHERE_OCR_ENABLED", "true")
    .strip()
    .lower()
    in {"1", "true", "yes", "on"}
)

OCR_LANGUAGE = (
    os.getenv("STUDYSPHERE_OCR_LANGUAGE", "eng").strip()
    or "eng"
)

try:
    OCR_DPI = int(os.getenv("STUDYSPHERE_OCR_DPI", "300"))
except (TypeError, ValueError):
    OCR_DPI = 300

OCR_DPI = max(180, min(OCR_DPI, 350))

try:
    MIN_PAGE_TEXT_LENGTH = int(
        os.getenv("STUDYSPHERE_MIN_PAGE_TEXT_LENGTH", "40")
    )
except (TypeError, ValueError):
    MIN_PAGE_TEXT_LENGTH = 40

MIN_PAGE_TEXT_LENGTH = max(1, MIN_PAGE_TEXT_LENGTH)

MAX_PAGE_TEXT_LENGTH = 20_000

TESSERACT_CMD = os.getenv("TESSERACT_CMD", "").strip()

# Fast-first OCR strategy:
# PSM 6 is normally best for lecture notes.
# PSM 3 is used only when PSM 6 looks weak.
# PSM 11 is used only as a final fallback.
PRIMARY_TESSERACT_CONFIG = "--oem 3 --psm 6"
FALLBACK_TESSERACT_CONFIG = "--oem 3 --psm 3"
FINAL_TESSERACT_CONFIG = "--oem 3 --psm 11"

MIN_OCR_WORDS = 4
MIN_OCR_ALPHANUMERIC = 12
MIN_OCR_CONFIDENCE = 18.0


# ============================================================
# TESSERACT CONFIGURATION
# ============================================================

def configure_tesseract() -> bool:
    """Configure Tesseract from .env, Windows default, or PATH."""

    if pytesseract is None:
        return False

    configured_path = TESSERACT_CMD

    if configured_path:
        configured_path = os.path.expandvars(
            os.path.expanduser(configured_path)
        )

        if os.path.isfile(configured_path):
            pytesseract.pytesseract.tesseract_cmd = configured_path
            return True

        logger.warning(
            "TESSERACT_CMD does not exist: %s",
            configured_path,
        )

    windows_default = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

    if os.path.isfile(windows_default):
        pytesseract.pytesseract.tesseract_cmd = windows_default
        return True

    pytesseract.pytesseract.tesseract_cmd = "tesseract"
    return True


# ============================================================
# OCR AVAILABILITY
# ============================================================

def is_ocr_available() -> bool:
    """Return True only when all OCR requirements are usable."""

    if not OCR_ENABLED:
        logger.info("OCR is disabled.")
        return False

    if fitz is None:
        logger.warning("OCR unavailable: PyMuPDF is not installed.")
        return False

    if Image is None:
        logger.warning("OCR unavailable: Pillow is not installed.")
        return False

    if pytesseract is None:
        logger.warning("OCR unavailable: pytesseract is not installed.")
        return False

    configure_tesseract()

    try:
        version = pytesseract.get_tesseract_version()
        logger.info("Tesseract OCR available: %s", version)
        return True
    except Exception as error:
        logger.warning("Tesseract OCR unavailable: %s", error)
        return False


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text: Optional[str]) -> str:
    """Normalize extracted text while preserving page/paragraph boundaries."""

    if not text:
        return ""

    text = str(text)
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")
    text = text.replace("\x00", "")
    text = text.replace("\u00a0", " ")

    lines = []

    for line in text.split("\n"):
        line = re.sub(r"[ \t]+", " ", line)
        lines.append(line.strip())

    text = "\n".join(lines)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


# ============================================================
# TEXT QUALITY
# ============================================================

def _text_metrics(text: str) -> Tuple[int, int, int, float]:
    """
    Return:
        characters, words, alphanumeric characters, alpha ratio
    """

    if not text:
        return 0, 0, 0, 0.0

    cleaned = normalize_text(text)

    characters = len(cleaned)

    words = re.findall(
        r"\b[A-Za-z][A-Za-z0-9'’+\-]{1,}\b",
        cleaned,
    )

    alphanumeric = len(
        re.findall(r"[A-Za-z0-9]", cleaned)
    )

    alpha_ratio = alphanumeric / max(characters, 1)

    return (
        characters,
        len(words),
        alphanumeric,
        alpha_ratio,
    )


def _ocr_quality(
    text: str,
    confidence: float = 0.0,
) -> float:
    """
    Lightweight OCR quality score.

    Used to decide whether another OCR pass is worthwhile.
    It is deliberately conservative and does not claim semantic
    correctness.
    """

    characters, words, alphanumeric, alpha_ratio = _text_metrics(text)

    if characters == 0:
        return 0.0

    confidence = max(0.0, min(float(confidence), 100.0))

    character_score = min(characters / 1200.0, 1.0) * 30.0
    word_score = min(words / 80.0, 1.0) * 25.0
    alpha_score = min(alpha_ratio / 0.55, 1.0) * 20.0
    confidence_score = confidence * 0.25

    symbol_penalty = max(0.0, 0.30 - alpha_ratio) * 100.0

    return max(
        0.0,
        character_score
        + word_score
        + alpha_score
        + confidence_score
        - symbol_penalty,
    )


def _has_sufficient_page_text(text: str) -> bool:
    """
    Decide whether native PDF text is usable enough to skip OCR.

    This avoids OCR on normal text PDFs, which keeps ingestion fast.
    """

    if not text:
        return False

    text = normalize_text(text)

    if len(text) < MIN_PAGE_TEXT_LENGTH:
        return False

    alphanumeric_count = len(
        re.findall(r"[A-Za-z0-9]", text)
    )

    if alphanumeric_count < 10:
        return False

    words = re.findall(
        r"\b[A-Za-z0-9][A-Za-z0-9'’+\-]*\b",
        text,
    )

    if len(words) < 3 and len(text) < 120:
        return False

    return True


def _ocr_result_is_good(
    text: str,
    confidence: float,
) -> bool:
    """Return True when OCR is good enough to stop immediately."""

    characters, words, alphanumeric, _ = _text_metrics(text)
    score = _ocr_quality(text, confidence)

    return (
        characters >= 180
        and words >= MIN_OCR_WORDS
        and alphanumeric >= MIN_OCR_ALPHANUMERIC
        and (
            confidence >= MIN_OCR_CONFIDENCE
            or score >= 45.0
        )
    )


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

def _prepare_primary_image(image):
    """
    Fast preprocessing for the first OCR pass.

    Only one image variant is created initially.
    """

    if ImageOps is None or ImageFilter is None:
        raise RuntimeError("Pillow is not installed.")

    gray = ImageOps.grayscale(image.convert("RGB"))
    gray = ImageOps.autocontrast(gray, cutoff=1)
    gray = gray.filter(ImageFilter.SHARPEN)

    return gray


def _prepare_fallback_image(image):
    """
    Stronger preprocessing used only if the primary OCR result
    is weak.
    """

    if ImageEnhance is None or ImageOps is None or ImageFilter is None:
        raise RuntimeError("Pillow is not installed.")

    gray = ImageOps.grayscale(image.convert("RGB"))
    gray = ImageOps.autocontrast(gray, cutoff=1)

    gray = ImageEnhance.Contrast(gray).enhance(1.35)
    gray = gray.filter(
        ImageFilter.UnsharpMask(
            radius=1,
            percent=140,
            threshold=3,
        )
    )

    return gray


def _prepare_final_image(image):
    """Final OCR preprocessing for irregular sparse layouts."""

    if ImageEnhance is None or ImageOps is None or ImageFilter is None:
        raise RuntimeError("Pillow is not installed.")

    gray = ImageOps.grayscale(image.convert("RGB"))
    gray = ImageOps.autocontrast(gray, cutoff=1)
    gray = ImageEnhance.Contrast(gray).enhance(1.5)
    gray = gray.filter(ImageFilter.SHARPEN)

    return gray


# ============================================================
# TESSERACT RUNNER
# ============================================================

def _run_tesseract(
    image,
    config: str,
) -> Tuple[str, float]:
    """Run Tesseract once and return text + average confidence."""

    if pytesseract is None:
        return "", 0.0

    try:
        text = pytesseract.image_to_string(
            image,
            lang=OCR_LANGUAGE,
            config=config,
        )
    except Exception as error:
        logger.warning(
            "Tesseract OCR failed with %s: %s",
            config,
            error,
        )
        return "", 0.0

    text = normalize_text(text)

    confidence = 0.0

    # Confidence extraction costs another Tesseract operation.
    # Do it only when text exists and therefore can influence
    # the fallback decision.
    if text:
        try:
            data = pytesseract.image_to_data(
                image,
                lang=OCR_LANGUAGE,
                config=config,
                output_type=pytesseract.Output.DICT,
            )

            values = []

            for raw_conf, raw_text in zip(
                data.get("conf", []),
                data.get("text", []),
            ):
                token = str(raw_text or "").strip()

                if not token:
                    continue

                try:
                    conf = float(raw_conf)
                except (TypeError, ValueError):
                    continue

                if conf >= 0:
                    values.append(conf)

            if values:
                confidence = sum(values) / len(values)

        except Exception as error:
            logger.debug(
                "Could not calculate OCR confidence: %s",
                error,
            )

    return text, confidence


# ============================================================
# OCR SINGLE PAGE
# ============================================================

def ocr_page(page) -> str:
    """
    Fast adaptive OCR for one PDF page.

    Pass 1:
        grayscale + sharpen + PSM 6

    If weak:
        stronger preprocessing + PSM 3

    If still weak:
        sparse-layout preprocessing + PSM 11

    This is intentionally NOT a 12-pass OCR system.
    """

    if fitz is None:
        raise RuntimeError("PyMuPDF is not installed.")

    if pytesseract is None:
        raise RuntimeError("pytesseract is not installed.")

    if Image is None:
        raise RuntimeError("Pillow is not installed.")

    configure_tesseract()

    scale = OCR_DPI / 72.0
    matrix = fitz.Matrix(scale, scale)

    pixmap = page.get_pixmap(
        matrix=matrix,
        alpha=False,
        colorspace=fitz.csRGB,
    )

    image = Image.frombytes(
        "RGB",
        (pixmap.width, pixmap.height),
        pixmap.samples,
    )

    best_text = ""
    best_confidence = 0.0
    best_score = 0.0

    try:
        # ====================================================
        # PASS 1 — FAST PRIMARY
        # ====================================================

        primary_image = _prepare_primary_image(image)

        primary_text, primary_confidence = _run_tesseract(
            primary_image,
            PRIMARY_TESSERACT_CONFIG,
        )

        primary_score = _ocr_quality(
            primary_text,
            primary_confidence,
        )

        best_text = primary_text
        best_confidence = primary_confidence
        best_score = primary_score

        chars, words, alnum, _ = _text_metrics(primary_text)

        logger.info(
            "OCR pass 1: chars=%d words=%d alnum=%d confidence=%.1f score=%.1f",
            chars,
            words,
            alnum,
            primary_confidence,
            primary_score,
        )

        # Stop early when the first OCR result is good.
        if _ocr_result_is_good(
            primary_text,
            primary_confidence,
        ):
            return primary_text

        # ====================================================
        # PASS 2 — STRONGER / AUTO LAYOUT
        # ====================================================

        fallback_image = _prepare_fallback_image(image)

        fallback_text, fallback_confidence = _run_tesseract(
            fallback_image,
            FALLBACK_TESSERACT_CONFIG,
        )

        fallback_score = _ocr_quality(
            fallback_text,
            fallback_confidence,
        )

        chars, words, alnum, _ = _text_metrics(fallback_text)

        logger.info(
            "OCR pass 2: chars=%d words=%d alnum=%d confidence=%.1f score=%.1f",
            chars,
            words,
            alnum,
            fallback_confidence,
            fallback_score,
        )

        if fallback_score > best_score:
            best_text = fallback_text
            best_confidence = fallback_confidence
            best_score = fallback_score

        # If pass 2 is good, stop.
        if _ocr_result_is_good(
            fallback_text,
            fallback_confidence,
        ):
            return fallback_text

        # ====================================================
        # PASS 3 — SPARSE / IRREGULAR LAYOUT
        # ====================================================

        final_image = _prepare_final_image(image)

        final_text, final_confidence = _run_tesseract(
            final_image,
            FINAL_TESSERACT_CONFIG,
        )

        final_score = _ocr_quality(
            final_text,
            final_confidence,
        )

        chars, words, alnum, _ = _text_metrics(final_text)

        logger.info(
            "OCR pass 3: chars=%d words=%d alnum=%d confidence=%.1f score=%.1f",
            chars,
            words,
            alnum,
            final_confidence,
            final_score,
        )

        if final_score > best_score:
            best_text = final_text
            best_confidence = final_confidence
            best_score = final_score

        return normalize_text(best_text)

    finally:
        try:
            image.close()
        except Exception:
            pass


# ============================================================
# NORMAL PDF TEXT EXTRACTION
# ============================================================

def extract_page_text(page) -> str:
    """Extract machine-readable text from a pypdf page."""

    try:
        text = page.extract_text()
    except Exception as error:
        logger.warning(
            "Normal PDF text extraction failed: %s",
            error,
        )
        return ""

    return normalize_text(text)


# ============================================================
# MAIN PDF EXTRACTION
# ============================================================

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from normal, scanned, mixed, or handwritten PDFs.

    Pipeline:

        PDF
          ↓
        Native extraction
          ↓
        Quality check
          ├── Good → keep native text
          └── Weak → OCR
          ↓
        [Page N]
          ↓
        chunking.py
    """

    if not pdf_path:
        raise ValueError("PDF path cannot be empty.")

    if not os.path.isfile(pdf_path):
        raise FileNotFoundError(
            f"PDF file not found: {pdf_path}"
        )

    if os.path.splitext(pdf_path)[1].lower() != ".pdf":
        raise ValueError("Only PDF files are supported.")

    logger.info("Opening PDF: %s", pdf_path)

    try:
        reader = PdfReader(pdf_path)
    except Exception as error:
        logger.exception("Unable to open PDF.")
        raise RuntimeError(
            f"Unable to read PDF: {error}"
        ) from error

    total_pages = len(reader.pages)

    if total_pages == 0:
        raise ValueError("The PDF contains no pages.")

    logger.info(
        "PDF contains %d page(s).",
        total_pages,
    )

    ocr_available = is_ocr_available()

    fitz_document = None

    if ocr_available:
        try:
            fitz_document = fitz.open(pdf_path)

            logger.info(
                "PyMuPDF opened successfully for OCR: %d page(s).",
                len(fitz_document),
            )

        except Exception as error:
            logger.warning(
                "Unable to open PDF with PyMuPDF: %s",
                error,
            )
            fitz_document = None
            ocr_available = False

    extracted_pages: List[str] = []

    native_pages = 0
    ocr_pages = 0
    unreadable_pages = 0

    native_chars = 0
    ocr_chars = 0

    try:
        for page_number, page in enumerate(
            reader.pages,
            start=1,
        ):
            logger.info(
                "[PAGE %d/%d] Starting extraction...",
                page_number,
                total_pages,
            )

            # =================================================
            # NATIVE EXTRACTION
            # =================================================

            native_text = extract_page_text(page)

            logger.info(
                "[PAGE %d] Native extraction: %d chars.",
                page_number,
                len(native_text),
            )

            page_text = native_text
            used_ocr = False

            # =================================================
            # OCR FALLBACK
            # =================================================

            if (
                not _has_sufficient_page_text(native_text)
                and ocr_available
                and fitz_document is not None
                and page_number <= len(fitz_document)
            ):
                logger.info(
                    "[PAGE %d] Native text insufficient. Starting OCR...",
                    page_number,
                )

                try:
                    ocr_text = ocr_page(
                        fitz_document[page_number - 1]
                    )

                    if ocr_text:
                        ocr_score = _ocr_quality(ocr_text)

                        logger.info(
                            "[PAGE %d] OCR selected: chars=%d score=%.1f",
                            page_number,
                            len(ocr_text),
                            ocr_score,
                        )

                        # Native text is already insufficient, so
                        # usable OCR should replace it.
                        if (
                            not native_text
                            or len(ocr_text) >= len(native_text)
                            or _text_metrics(ocr_text)[1] >= MIN_OCR_WORDS
                        ):
                            page_text = ocr_text
                            used_ocr = True

                except Exception as error:
                    logger.warning(
                        "[PAGE %d] OCR failed: %s",
                        page_number,
                        error,
                    )

            # =================================================
            # PROTECT AGAINST HUGE PAGES
            # =================================================

            if len(page_text) > MAX_PAGE_TEXT_LENGTH:
                logger.warning(
                    "[PAGE %d] Text exceeded %d chars. Truncating.",
                    page_number,
                    MAX_PAGE_TEXT_LENGTH,
                )
                page_text = (
                    page_text[:MAX_PAGE_TEXT_LENGTH]
                    .rstrip()
                )

            # =================================================
            # STATS
            # =================================================

            if page_text:
                if used_ocr:
                    ocr_pages += 1
                    ocr_chars += len(page_text)

                    logger.info(
                        "[PAGE %d] OCR accepted: %d chars.",
                        page_number,
                        len(page_text),
                    )
                else:
                    native_pages += 1
                    native_chars += len(page_text)

                    logger.info(
                        "[PAGE %d] Native text accepted: %d chars.",
                        page_number,
                        len(page_text),
                    )
            else:
                unreadable_pages += 1

                logger.warning(
                    "[PAGE %d] No readable text found.",
                    page_number,
                )

            # =================================================
            # PAGE MARKER
            # =================================================

            if page_text:
                extracted_pages.append(
                    f"[Page {page_number}]\n{page_text}"
                )

    finally:
        if fitz_document is not None:
            try:
                fitz_document.close()
            except Exception:
                pass

    # ========================================================
    # FINAL TEXT
    # ========================================================

    final_text = normalize_text(
        "\n\n".join(extracted_pages)
    )

    if not final_text:
        if OCR_ENABLED and not ocr_available:
            raise ValueError(
                "No readable text could be extracted. "
                "OCR is enabled but Tesseract/PyMuPDF/Pillow "
                "is unavailable."
            )

        raise ValueError(
            "No readable text could be extracted from the PDF."
        )

    # ========================================================
    # FINAL LOGGING
    # ========================================================

    logger.info("=" * 68)
    logger.info("PDF EXTRACTION COMPLETED")
    logger.info("Pages                  : %d", total_pages)
    logger.info("Native-text pages      : %d", native_pages)
    logger.info("OCR pages              : %d", ocr_pages)
    logger.info("Unreadable pages       : %d", unreadable_pages)
    logger.info("Native extracted chars : %d", native_chars)
    logger.info("OCR extracted chars    : %d", ocr_chars)
    logger.info("Final characters       : %d", len(final_text))
    logger.info("=" * 68)

    return final_text


# ============================================================
# DEBUG / MANUAL TEST
# ============================================================

def test_pdf_extraction(pdf_path: str) -> None:
    """Run extraction and print useful OCR diagnostics."""

    print()
    print("=" * 72)
    print("STUDYSPHERE PDF / OCR DIAGNOSTIC")
    print("=" * 72)
    print(f"PDF            : {pdf_path}")
    print(f"OCR enabled    : {OCR_ENABLED}")
    print(f"OCR language   : {OCR_LANGUAGE}")
    print(f"OCR DPI        : {OCR_DPI}")
    print(f"Tesseract path : {TESSERACT_CMD or 'auto-detect'}")
    print(f"OCR available  : {is_ocr_available()}")
    print("-" * 72)

    try:
        text = extract_text_from_pdf(pdf_path)

        print(f"TOTAL CHARS: {len(text)}")

        lower = text.lower()

        for phrase in (
            "supervised learning",
            "unsupervised learning",
            "reinforcement learning",
            "machine learning",
        ):
            print(
                f"{phrase!r}:",
                phrase in lower,
            )

        markers = re.findall(
            r"\[Page\s+(\d+)\]",
            text,
            re.IGNORECASE,
        )

        print("PAGE MARKERS:", len(markers))
        print("-" * 72)
        print(text[:5000])
        print("-" * 72)

    except Exception as error:
        print("EXTRACTION FAILED:")
        print(repr(error))

    print("=" * 72)


# ============================================================
# MODULE INFORMATION
# ============================================================

def get_pdf_utils_info() -> dict:
    """Return PDF/OCR capabilities and configuration."""

    return {
        "pdf_only": True,
        "normal_pdf_extraction": True,
        "ocr_enabled": OCR_ENABLED,
        "ocr_language": OCR_LANGUAGE,
        "ocr_dpi": OCR_DPI,
        "page_markers": True,
        "scanned_pdf_support": True,
        "image_pdf_support": True,
        "handwritten_pdf_support": True,
        "adaptive_ocr": True,
        "multi_psm_fallback": True,
        "ocr_quality_selection": True,
        "tesseract_available": (
            is_ocr_available()
            if OCR_ENABLED
            else False
        ),
        "primary_ocr_mode": PRIMARY_TESSERACT_CONFIG,
        "fallback_ocr_mode": FALLBACK_TESSERACT_CONFIG,
        "final_ocr_mode": FINAL_TESSERACT_CONFIG,
    }
