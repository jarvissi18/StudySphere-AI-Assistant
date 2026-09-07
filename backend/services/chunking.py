import re


# ============================================================
# CONFIGURATION
# ============================================================

DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 200


# ============================================================
# PAGE MARKER
# ============================================================

PAGE_MARKER_PATTERN = re.compile(
    r"^\[Page\s+(\d+)\]\s*$",
    re.IGNORECASE,
)


# ============================================================
# TEXT CLEANING
# ============================================================

def _clean_text(text: str) -> str:
    """
    Clean extracted PDF/OCR text while preserving useful
    paragraph and page structure.
    """

    if not text:
        return ""

    text = str(text)

    text = text.replace(
        "\r\n",
        "\n",
    )

    text = text.replace(
        "\r",
        "\n",
    )

    text = re.sub(
        r"[ \t]+",
        " ",
        text,
    )

    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text,
    )

    text = re.sub(
        r" *\n *",
        "\n",
        text,
    )

    return text.strip()


# ============================================================
# PAGE MARKER HELPERS
# ============================================================

def _is_page_marker(
    text: str,
) -> bool:
    """
    Return True when the supplied text is exactly a page marker.
    """

    if not text:
        return False

    return bool(
        PAGE_MARKER_PATTERN.fullmatch(
            text.strip()
        )
    )


def _extract_page_marker(
    text: str,
) -> str:
    """
    Return the page marker from a section.

    Example:

        [Page 14]

    returns:

        [Page 14]

    Returns empty string when no marker exists.
    """

    if not text:
        return ""

    match = PAGE_MARKER_PATTERN.fullmatch(
        text.strip()
    )

    if not match:
        return ""

    return (
        f"[Page {match.group(1)}]"
    )


# ============================================================
# SPLIT LONG PARAGRAPH
# ============================================================

def _split_long_paragraph(
    paragraph: str,
    chunk_size: int,
) -> list[str]:
    """
    Split a paragraph that is larger than chunk_size.

    Preferred split order:

        1. Sentence boundary
        2. Word boundary
        3. Hard character boundary
    """

    parts = []

    remaining = paragraph.strip()

    while len(remaining) > chunk_size:

        candidate = remaining[
            :chunk_size
        ]

        sentence_matches = list(
            re.finditer(
                r"[.!?](?:\s|$)",
                candidate,
            )
        )

        if sentence_matches:

            split_at = (
                sentence_matches[-1].end()
            )

        else:

            split_at = candidate.rfind(
                " "
            )

            if split_at <= 0:
                split_at = chunk_size

        part = remaining[
            :split_at
        ].strip()

        if part:
            parts.append(part)

        remaining = remaining[
            split_at:
        ].strip()

    if remaining:
        parts.append(remaining)

    return parts


# ============================================================
# SECTION SPLITTING
# ============================================================

def _split_into_sections(
    text: str,
    chunk_size: int,
) -> list[str]:
    """
    Split extracted document text into logical sections while
    permanently associating content with its PDF page.

    Example input:

        [Page 10]

        TLB is a cache...

        [Page 11]

        The TLB stores...

    Every resulting content section keeps its page marker.
    """

    paragraphs = re.split(
        r"\n\s*\n",
        text,
    )

    sections = []

    current_content = ""
    current_page_marker = ""

    def flush_current():
        nonlocal current_content
        nonlocal current_page_marker

        if not current_content.strip():
            current_content = ""
            return

        content = current_content.strip()

        if current_page_marker:
            content = (
                f"{current_page_marker}\n"
                f"{content}"
            )

        sections.append(
            content.strip()
        )

        current_content = ""

    for paragraph in paragraphs:

        paragraph = paragraph.strip()

        if not paragraph:
            continue

        # ----------------------------------------------------
        # Page marker
        # ----------------------------------------------------

        page_marker = _extract_page_marker(
            paragraph
        )

        if page_marker:

            flush_current()

            current_page_marker = (
                page_marker
            )

            continue

        # ----------------------------------------------------
        # Large paragraph
        # ----------------------------------------------------

        if len(paragraph) > chunk_size:

            flush_current()

            long_parts = (
                _split_long_paragraph(
                    paragraph,
                    chunk_size,
                )
            )

            for part in long_parts:

                if current_page_marker:

                    sections.append(
                        (
                            f"{current_page_marker}\n"
                            f"{part}"
                        ).strip()
                    )

                else:

                    sections.append(
                        part.strip()
                    )

            continue

        # ----------------------------------------------------
        # Add paragraph to current section
        # ----------------------------------------------------

        if not current_content:

            current_content = paragraph

        elif (
            len(current_content)
            + 2
            + len(paragraph)
            <= chunk_size
        ):

            current_content += (
                "\n\n"
                + paragraph
            )

        else:

            flush_current()

            current_content = paragraph

    # --------------------------------------------------------
    # Final section
    # --------------------------------------------------------

    flush_current()

    return sections


# ============================================================
# ADD OVERLAP
# ============================================================

def _add_overlap(
    chunks: list[str],
    overlap: int,
) -> list[str]:
    """
    Add contextual overlap between neighboring chunks.

    Page markers are preserved as part of the chunk metadata
    source context.
    """

    if not chunks or overlap <= 0:
        return chunks

    final_chunks = []

    for index, chunk in enumerate(chunks):

        if index == 0:

            final_chunks.append(
                chunk
            )

            continue

        previous = chunks[
            index - 1
        ]

        # ----------------------------------------------------
        # Extract page markers from current and previous chunk.
        # ----------------------------------------------------

        current_page_match = (
            re.search(
                r"\[Page\s+\d+\]",
                chunk,
                re.IGNORECASE,
            )
        )

        previous_page_match = (
            re.search(
                r"\[Page\s+\d+\]",
                previous,
                re.IGNORECASE,
            )
        )

        current_page_marker = (
            current_page_match.group(0)
            if current_page_match
            else ""
        )

        previous_page_marker = (
            previous_page_match.group(0)
            if previous_page_match
            else ""
        )

        # ----------------------------------------------------
        # Remove page marker before calculating overlap.
        # ----------------------------------------------------

        previous_content = re.sub(
            r"\[Page\s+\d+\]",
            "",
            previous,
            count=1,
            flags=re.IGNORECASE,
        ).strip()

        overlap_text = previous_content[
            -overlap:
        ]

        first_space = (
            overlap_text.find(" ")
        )

        if first_space > 0:

            overlap_text = (
                overlap_text[
                    first_space + 1:
                ]
            )

        current_content = re.sub(
            r"^\[Page\s+\d+\]\s*",
            "",
            chunk,
            count=1,
            flags=re.IGNORECASE,
        ).strip()

        parts = []

        if current_page_marker:

            parts.append(
                current_page_marker
            )

        elif previous_page_marker:

            parts.append(
                previous_page_marker
            )

        if overlap_text.strip():

            parts.append(
                overlap_text.strip()
            )

        if current_content:

            parts.append(
                current_content
            )

        combined = "\n\n".join(
            parts
        ).strip()

        final_chunks.append(
            combined
        )

    return final_chunks


# ============================================================
# MAIN CHUNKING FUNCTION
# ============================================================

def chunk_text(
    text: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[str]:
    """
    Convert extracted PDF/OCR text into RAG-ready chunks.

    Page markers are preserved so downstream ChromaDB
    metadata can associate every chunk with its original
    PDF page.
    """

    if not text:
        return []

    # ========================================================
    # VALIDATE PARAMETERS
    # ========================================================

    try:

        chunk_size = int(
            chunk_size
        )

        overlap = int(
            overlap
        )

    except (
        TypeError,
        ValueError,
    ):

        raise ValueError(
            "chunk_size and overlap must be integers."
        )

    if chunk_size <= 0:

        raise ValueError(
            "chunk_size must be greater than 0."
        )

    if overlap < 0:

        raise ValueError(
            "overlap cannot be negative."
        )

    if overlap >= chunk_size:

        raise ValueError(
            "overlap must be smaller than chunk_size."
        )

    # ========================================================
    # CLEAN TEXT
    # ========================================================

    text = _clean_text(
        text
    )

    if not text:
        return []

    # ========================================================
    # CREATE SECTIONS
    # ========================================================

    sections = _split_into_sections(
        text=text,
        chunk_size=chunk_size,
    )

    if not sections:
        return []

    # ========================================================
    # ADD OVERLAP
    # ========================================================

    chunks = _add_overlap(
        chunks=sections,
        overlap=overlap,
    )

    # ========================================================
    # FINAL CLEANUP
    # ========================================================

    cleaned_chunks = []

    for chunk in chunks:

        chunk = chunk.strip()

        if not chunk:
            continue

        # ----------------------------------------------------
        # Ignore page-marker-only chunks.
        # ----------------------------------------------------

        if _is_page_marker(
            chunk
        ):
            continue

        # ----------------------------------------------------
        # Prevent exact consecutive duplicates.
        # ----------------------------------------------------

        if (
            cleaned_chunks
            and chunk
            == cleaned_chunks[-1]
        ):
            continue

        cleaned_chunks.append(
            chunk
        )

    # ========================================================
    # LOGGING
    # ========================================================

    print(
        "[Chunking] "
        f"Created {len(cleaned_chunks)} chunks "
        f"(size={chunk_size}, overlap={overlap})"
    )

    # ========================================================
    # PAGE DEBUGGING
    # ========================================================

    for index, chunk in enumerate(
        cleaned_chunks,
        start=1,
    ):

        pages = re.findall(
            r"\[Page\s+(\d+)\]",
            chunk,
            re.IGNORECASE,
        )

        if pages:

            print(
                "[Chunking] "
                f"Chunk {index}: page(s)="
                f"{','.join(pages)}"
            )

        else:

            print(
                "[Chunking] "
                f"Chunk {index}: page(s)=unknown"
            )

    return cleaned_chunks


# ============================================================
# CHUNKING TEST HELPER
# ============================================================

def test_chunking(
    text: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> None:
    """
    Development helper to inspect generated chunks.
    """

    print()
    print("=" * 72)
    print("STUDYSPHERE CHUNKING TEST")
    print("=" * 72)

    chunks = chunk_text(
        text=text,
        chunk_size=chunk_size,
        overlap=overlap,
    )

    print(
        f"Total chunks: {len(chunks)}"
    )

    print()

    for index, chunk in enumerate(
        chunks,
        start=1,
    ):

        print(
            f"--- CHUNK {index} "
            f"({len(chunk)} chars) ---"
        )

        print(chunk)

        print()

    print("=" * 72)