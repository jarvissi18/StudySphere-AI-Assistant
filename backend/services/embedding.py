# ============================================================
# StudySphere AI - Embedding Service
# Sentence-Transformers based document + query embeddings
# ============================================================

import os
from typing import (
    List,
    Sequence,
)

import numpy as np

from sentence_transformers import (
    SentenceTransformer,
)


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_NAME = "all-MiniLM-L6-v2"

EXPECTED_EMBEDDING_DIMENSION = 384

# Batch size used internally by SentenceTransformer.
# It does not change the public API.
ENCODE_BATCH_SIZE = 32

# Normalized embeddings are required for the current
# ChromaDB cosine-distance configuration.
NORMALIZE_EMBEDDINGS = True


# ============================================================
# MODEL INITIALIZATION
# ============================================================

print()
print("=" * 72)
print("STUDYSPHERE EMBEDDING SERVICE")
print("=" * 72)
print(
    "[Embedding] Loading model:",
    MODEL_NAME,
)

try:

    _model = SentenceTransformer(
        MODEL_NAME
    )

except Exception as error:

    print(
        "[Embedding] Failed to load model:",
        repr(error),
    )

    raise RuntimeError(
        "Unable to load the SentenceTransformer embedding model."
    ) from error


print(
    "[Embedding] Model loaded successfully."
)

print(
    "[Embedding] Expected dimension:",
    EXPECTED_EMBEDDING_DIMENSION,
)

print("=" * 72)
print()


# ============================================================
# MODEL VALIDATION
# ============================================================

def _validate_model_dimension() -> None:
    """
    Verify that the loaded SentenceTransformer model produces
    the expected vector dimension.
    """

    try:

        actual_dimension = int(
            _model.get_sentence_embedding_dimension()
        )

    except Exception as error:

        raise RuntimeError(
            "Unable to determine embedding model dimension."
        ) from error

    if actual_dimension != (
        EXPECTED_EMBEDDING_DIMENSION
    ):

        raise RuntimeError(
            "Embedding model dimension mismatch. "
            f"Expected "
            f"{EXPECTED_EMBEDDING_DIMENSION}, "
            f"received {actual_dimension}."
        )


_validate_model_dimension()


# ============================================================
# INTERNAL TEXT VALIDATION
# ============================================================

def _validate_text(
    text: str,
) -> str:
    """
    Validate and normalize a single text input.
    """

    if text is None:

        raise ValueError(
            "Text cannot be None."
        )

    text = str(
        text
    ).strip()

    if not text:

        raise ValueError(
            "Text cannot be empty."
        )

    return text


def _validate_chunks(
    chunks: Sequence[str],
) -> List[str]:
    """
    Validate a collection of document chunks.

    Empty chunks are rejected instead of silently removed so
    chunk/embedding indexing remains perfectly aligned.
    """

    if not isinstance(
        chunks,
        (list, tuple),
    ):

        raise TypeError(
            "chunks must be a list or tuple of strings."
        )

    if not chunks:

        raise ValueError(
            "chunks cannot be empty."
        )

    cleaned_chunks: List[str] = []

    for index, chunk in enumerate(
        chunks
    ):

        if chunk is None:

            raise ValueError(
                f"Chunk {index} cannot be None."
            )

        chunk = str(
            chunk
        ).strip()

        if not chunk:

            raise ValueError(
                f"Chunk {index} cannot be empty."
            )

        cleaned_chunks.append(
            chunk
        )

    return cleaned_chunks


# ============================================================
# EMBEDDING ARRAY VALIDATION
# ============================================================

def _validate_embedding_array(
    embeddings,
    expected_count: int,
) -> np.ndarray:
    """
    Validate SentenceTransformer output.
    """

    array = np.asarray(
        embeddings,
        dtype=np.float32,
    )

    # --------------------------------------------------------
    # Ensure 2D output.
    #
    # SentenceTransformer normally returns:
    #
    #     (number_of_texts, embedding_dimension)
    #
    # --------------------------------------------------------

    if array.ndim == 1:

        # A single embedding can sometimes appear as a 1D
        # array depending on encoder configuration.
        #
        # Convert it to a 2D array only when exactly one
        # input was supplied.
        if expected_count == 1:

            array = array.reshape(
                1,
                -1,
            )

        else:

            raise ValueError(
                "Embedding output must be a "
                "2-dimensional array."
            )

    if array.ndim != 2:

        raise ValueError(
            "Embedding output must be a "
            "2-dimensional array."
        )

    # --------------------------------------------------------
    # Count validation
    # --------------------------------------------------------

    if array.shape[0] != (
        expected_count
    ):

        raise ValueError(
            "Embedding count does not match "
            "the number of input chunks. "
            f"Expected {expected_count}, "
            f"received {array.shape[0]}."
        )

    # --------------------------------------------------------
    # Dimension validation
    # --------------------------------------------------------

    if array.shape[1] != (
        EXPECTED_EMBEDDING_DIMENSION
    ):

        raise ValueError(
            "Unexpected embedding dimension. "
            f"Expected "
            f"{EXPECTED_EMBEDDING_DIMENSION}, "
            f"received {array.shape[1]}."
        )

    # --------------------------------------------------------
    # Numerical validation
    # --------------------------------------------------------

    if not np.isfinite(
        array
    ).all():

        raise ValueError(
            "Embeddings contain NaN or infinite values."
        )

    # --------------------------------------------------------
    # Zero-vector validation
    # --------------------------------------------------------

    norms = np.linalg.norm(
        array,
        axis=1,
    )

    if np.any(
        norms == 0
    ):

        raise ValueError(
            "One or more embeddings are zero vectors."
        )

    return array


# ============================================================
# GENERATE DOCUMENT EMBEDDINGS
# ============================================================

def generate_embeddings(
    chunks: Sequence[str],
) -> List[List[float]]:
    """
    Generate normalized embeddings for document chunks.

    The same model is used for every uploaded PDF and for
    user queries.

    Args:
        chunks:
            List or tuple of document chunks.

    Returns:
        List of 384-dimensional embedding vectors.
    """

    # ========================================================
    # VALIDATE INPUT
    # ========================================================

    cleaned_chunks = _validate_chunks(
        chunks
    )

    print(
        "[Embedding] Generating embeddings for "
        f"{len(cleaned_chunks)} chunk(s)..."
    )

    # ========================================================
    # GENERATE EMBEDDINGS
    # ========================================================

    try:

        embeddings = _model.encode(
            cleaned_chunks,
            batch_size=ENCODE_BATCH_SIZE,
            normalize_embeddings=(
                NORMALIZE_EMBEDDINGS
            ),
            convert_to_numpy=True,
            show_progress_bar=False,
        )

    except Exception as error:

        print(
            "[Embedding] Generation failed:",
            repr(error),
        )

        raise RuntimeError(
            "Unable to generate document embeddings."
        ) from error

    # ========================================================
    # VALIDATE OUTPUT
    # ========================================================

    embeddings_array = (
        _validate_embedding_array(
            embeddings=embeddings,
            expected_count=len(
                cleaned_chunks
            ),
        )
    )

    # ========================================================
    # FINAL NORMALIZATION SAFETY
    # ========================================================

    if NORMALIZE_EMBEDDINGS:

        norms = np.linalg.norm(
            embeddings_array,
            axis=1,
            keepdims=True,
        )

        embeddings_array = (
            embeddings_array
            / np.maximum(
                norms,
                1e-12,
            )
        )

    # ========================================================
    # CONVERT TO PYTHON LIST
    # ========================================================

    embedding_list = (
        embeddings_array.tolist()
    )

    # ========================================================
    # FINAL VALIDATION
    # ========================================================

    if len(
        embedding_list
    ) != len(
        cleaned_chunks
    ):

        raise ValueError(
            "Final embedding count does not "
            "match chunk count."
        )

    if not embedding_list:

        raise ValueError(
            "Embedding generation returned no vectors."
        )

    print(
        "[Embedding] Successfully generated "
        f"{len(embedding_list)} embedding(s)."
    )

    print(
        "[Embedding] Dimension:",
        len(
            embedding_list[0]
        ),
    )

    return embedding_list


# ============================================================
# GENERATE QUERY EMBEDDING
# ============================================================

def generate_query_embedding(
    question: str,
) -> List[float]:
    """
    Generate a normalized embedding for a user's question.

    The query uses exactly the same model and normalization
    configuration as document embeddings.
    """

    question = _validate_text(
        question
    )

    print(
        "[Embedding] Generating query embedding..."
    )

    # ========================================================
    # GENERATE
    # ========================================================

    try:

        embedding = _model.encode(
            question,
            normalize_embeddings=(
                NORMALIZE_EMBEDDINGS
            ),
            convert_to_numpy=True,
            show_progress_bar=False,
        )

    except Exception as error:

        print(
            "[Embedding] Query embedding failed:",
            repr(error),
        )

        raise RuntimeError(
            "Unable to generate query embedding."
        ) from error

    # ========================================================
    # CONVERT TO ARRAY
    # ========================================================

    array = np.asarray(
        embedding,
        dtype=np.float32,
    )

    # --------------------------------------------------------
    # A query must produce exactly one vector.
    # --------------------------------------------------------

    if array.ndim != 1:

        raise ValueError(
            "Query embedding must be a "
            "1-dimensional vector."
        )

    # ========================================================
    # DIMENSION VALIDATION
    # ========================================================

    if len(array) != (
        EXPECTED_EMBEDDING_DIMENSION
    ):

        raise ValueError(
            "Unexpected query embedding dimension. "
            f"Expected "
            f"{EXPECTED_EMBEDDING_DIMENSION}, "
            f"received {len(array)}."
        )

    # ========================================================
    # NUMERICAL VALIDATION
    # ========================================================

    if not np.isfinite(
        array
    ).all():

        raise ValueError(
            "Query embedding contains "
            "NaN or infinite values."
        )

    # ========================================================
    # ZERO-VECTOR VALIDATION
    # ========================================================

    norm = np.linalg.norm(
        array
    )

    if norm == 0:

        raise ValueError(
            "Query embedding cannot be a zero vector."
        )

    # ========================================================
    # FINAL NORMALIZATION SAFETY
    # ========================================================

    if NORMALIZE_EMBEDDINGS:

        array = (
            array
            / max(
                norm,
                1e-12,
            )
        )

    return array.tolist()


# ============================================================
# GET EMBEDDING DIMENSION
# ============================================================

def get_embedding_dimension() -> int:
    """
    Return the expected embedding vector dimension.
    """

    return (
        EXPECTED_EMBEDDING_DIMENSION
    )


# ============================================================
# GET MODEL NAME
# ============================================================

def get_embedding_model_name() -> str:
    """
    Return the active SentenceTransformer model name.
    """

    return MODEL_NAME


# ============================================================
# COSINE SIMILARITY
# ============================================================

def cosine_similarity(
    vector_a: Sequence[float],
    vector_b: Sequence[float],
) -> float:
    """
    Calculate cosine similarity between two vectors.

    Since embeddings are normalized, the result is effectively
    their dot product, although norms are still calculated for
    safety.
    """

    # ========================================================
    # CONVERT
    # ========================================================

    a = np.asarray(
        vector_a,
        dtype=np.float32,
    )

    b = np.asarray(
        vector_b,
        dtype=np.float32,
    )

    # ========================================================
    # DIMENSION VALIDATION
    # ========================================================

    if a.ndim != 1:

        raise ValueError(
            "vector_a must be 1-dimensional."
        )

    if b.ndim != 1:

        raise ValueError(
            "vector_b must be 1-dimensional."
        )

    if a.shape != b.shape:

        raise ValueError(
            "Both vectors must have the same dimension."
        )

    if len(a) != (
        EXPECTED_EMBEDDING_DIMENSION
    ):

        raise ValueError(
            "vector_a has an unexpected dimension. "
            f"Expected "
            f"{EXPECTED_EMBEDDING_DIMENSION}, "
            f"received {len(a)}."
        )

    # ========================================================
    # NUMERICAL VALIDATION
    # ========================================================

    if not np.isfinite(
        a
    ).all():

        raise ValueError(
            "vector_a contains invalid values."
        )

    if not np.isfinite(
        b
    ).all():

        raise ValueError(
            "vector_b contains invalid values."
        )

    # ========================================================
    # NORMS
    # ========================================================

    norm_a = np.linalg.norm(
        a
    )

    norm_b = np.linalg.norm(
        b
    )

    if norm_a == 0:

        raise ValueError(
            "vector_a cannot be a zero vector."
        )

    if norm_b == 0:

        raise ValueError(
            "vector_b cannot be a zero vector."
        )

    # ========================================================
    # COSINE SIMILARITY
    # ========================================================

    similarity = (
        np.dot(a, b)
        / (
            norm_a
            * norm_b
        )
    )

    # Floating-point safety.
    similarity = float(
        np.clip(
            similarity,
            -1.0,
            1.0,
        )
    )

    return similarity


# ============================================================
# EMBEDDING TEST
# ============================================================

def test_embedding() -> None:
    """
    Development test for the complete embedding service.
    """

    print()
    print("=" * 72)
    print(
        "STUDYSPHERE EMBEDDING TEST"
    )
    print("=" * 72)

    test_chunks = [
        (
            "Software testing is the process of "
            "evaluating software to find defects."
        ),
        (
            "Verification checks whether the product "
            "is being built correctly."
        ),
        (
            "Validation checks whether the correct "
            "product is being built."
        ),
    ]

    # ========================================================
    # DOCUMENT EMBEDDINGS
    # ========================================================

    embeddings = generate_embeddings(
        test_chunks
    )

    print()
    print(
        "Document embeddings:",
        len(embeddings),
    )

    print(
        "Embedding dimension:",
        len(
            embeddings[0]
        ),
    )

    # ========================================================
    # QUERY EMBEDDING
    # ========================================================

    query = (
        "What is software verification?"
    )

    query_embedding = (
        generate_query_embedding(
            query
        )
    )

    print(
        "Query dimension:",
        len(
            query_embedding
        ),
    )

    # ========================================================
    # SIMILARITY TEST
    # ========================================================

    verification_similarity = (
        cosine_similarity(
            embeddings[1],
            query_embedding,
        )
    )

    validation_similarity = (
        cosine_similarity(
            embeddings[2],
            query_embedding,
        )
    )

    testing_similarity = (
        cosine_similarity(
            embeddings[0],
            query_embedding,
        )
    )

    print()
    print(
        "Similarity scores:"
    )

    print(
        f"  Verification : "
        f"{verification_similarity:.4f}"
    )

    print(
        f"  Validation   : "
        f"{validation_similarity:.4f}"
    )

    print(
        f"  Testing      : "
        f"{testing_similarity:.4f}"
    )

    # ========================================================
    # SINGLE-CHUNK TEST
    # ========================================================

    single_embedding = (
        generate_embeddings(
            [
                "This is a single document chunk."
            ]
        )
    )

    if len(
        single_embedding
    ) != 1:

        raise RuntimeError(
            "Single-chunk embedding test failed."
        )

    print()
    print(
        "Single-chunk test: PASSED"
    )

    # ========================================================
    # FINAL
    # ========================================================

    print()
    print(
        "Embedding service test completed successfully."
    )

    print("=" * 72)


# ============================================================
# MODULE INFORMATION
# ============================================================

def get_embedding_info() -> dict:
    """
    Return useful information about the embedding service.
    """

    return {
        "model": MODEL_NAME,
        "dimension": (
            EXPECTED_EMBEDDING_DIMENSION
        ),
        "normalized": (
            NORMALIZE_EMBEDDINGS
        ),
        "batch_size": (
            ENCODE_BATCH_SIZE
        ),
        "provider": "sentence-transformers",
        "model_loaded": (
            _model is not None
        ),
    }