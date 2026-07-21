import re


def chunk_text(text, chunk_size=600, overlap=150):
    """
    Better chunking for PDF text.
    """

    # Clean text
    text = re.sub(r"\s+", " ", text).strip()

    chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        chunk = text[start:end]

        # Try ending at a sentence
        last_period = chunk.rfind(".")

        if last_period > chunk_size * 0.6:
            end = start + last_period + 1
            chunk = text[start:end]

        chunks.append(chunk.strip())

        start = end - overlap

    return chunks