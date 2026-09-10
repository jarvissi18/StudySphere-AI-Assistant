# ============================================================
# StudySphere AI - Embedding Service
# ONNX Runtime based document + query embeddings
# ============================================================

from typing import Any, List, Sequence
import os
import threading

import numpy as np
import onnxruntime as ort
from huggingface_hub import hf_hub_download
from transformers import AutoTokenizer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EXPECTED_EMBEDDING_DIMENSION = 384
ENCODE_BATCH_SIZE = 32
NORMALIZE_EMBEDDINGS = True
ONNX_FILENAME = "onnx/model.onnx"

_model = None
_tokenizer = None
_model_lock = threading.Lock()


def _load_tokenizer():
    global _tokenizer
    if _tokenizer is not None:
        return _tokenizer
    with _model_lock:
        if _tokenizer is None:
            print(f"[Embedding] Loading tokenizer: {MODEL_NAME}", flush=True)
            _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            print("[Embedding] Tokenizer loaded successfully.", flush=True)
    return _tokenizer


def _validate_model_dimension(model: Any) -> None:
    try:
        shape = model.get_outputs()[0].shape
        if len(shape) != 3:
            raise RuntimeError(f"Unexpected ONNX output shape: {shape}")
        dim = shape[-1]
        if isinstance(dim, int) and dim != EXPECTED_EMBEDDING_DIMENSION:
            raise RuntimeError(
                f"Embedding model dimension mismatch. Expected {EXPECTED_EMBEDDING_DIMENSION}, received {dim}."
            )
    except Exception as error:
        if isinstance(error, RuntimeError):
            raise
        raise RuntimeError("Unable to determine ONNX embedding model dimension.") from error


def get_model() -> ort.InferenceSession:
    global _model
    if _model is not None:
        return _model
    with _model_lock:
        if _model is not None:
            return _model
        print("=" * 72, flush=True)
        print("STUDYSPHERE ONNX EMBEDDING SERVICE", flush=True)
        print(f"[Embedding] Model: {MODEL_NAME}", flush=True)
        print("[Embedding] Provider: ONNX Runtime / CPU", flush=True)
        try:
            model_path = hf_hub_download(
                repo_id=MODEL_NAME,
                filename=ONNX_FILENAME,
            )
            options = ort.SessionOptions()
            options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
            options.intra_op_num_threads = max(1, min(4, os.cpu_count() or 1))
            options.inter_op_num_threads = 1
            loaded = ort.InferenceSession(
                model_path,
                sess_options=options,
                providers=["CPUExecutionProvider"],
            )
            _validate_model_dimension(loaded)
        except Exception as error:
            print(f"[Embedding] Failed to load ONNX model: {error!r}", flush=True)
            raise RuntimeError("Unable to load the ONNX embedding model.") from error
        _model = loaded
        print("[Embedding] ONNX model loaded successfully.", flush=True)
        print(f"[Embedding] Inputs: {[x.name for x in loaded.get_inputs()]}", flush=True)
        print(f"[Embedding] Outputs: {[x.name for x in loaded.get_outputs()]}", flush=True)
        print("=" * 72, flush=True)
        return _model


def _validate_text(text: str) -> str:
    if text is None:
        raise ValueError("Text cannot be None.")
    text = str(text).strip()
    if not text:
        raise ValueError("Text cannot be empty.")
    return text


def _validate_chunks(chunks: Sequence[str]) -> List[str]:
    if not isinstance(chunks, (list, tuple)):
        raise TypeError("chunks must be a list or tuple of strings.")
    if not chunks:
        raise ValueError("chunks cannot be empty.")
    cleaned = []
    for index, chunk in enumerate(chunks):
        if chunk is None:
            raise ValueError(f"Chunk {index} cannot be None.")
        chunk = str(chunk).strip()
        if not chunk:
            raise ValueError(f"Chunk {index} cannot be empty.")
        cleaned.append(chunk)
    return cleaned


def _mean_pooling(token_embeddings: np.ndarray, attention_mask: np.ndarray) -> np.ndarray:
    mask = attention_mask.astype(np.float32)[..., np.newaxis]
    summed = np.sum(token_embeddings * mask, axis=1)
    counts = np.clip(np.sum(mask, axis=1), 1e-9, None)
    return summed / counts


def _normalize(array: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(array, axis=1, keepdims=True)
    return array / np.clip(norms, 1e-12, None)


def _encode(texts: Sequence[str]) -> np.ndarray:
    tokenizer = _load_tokenizer()
    model = get_model()
    encoded = tokenizer(
        list(texts),
        padding=True,
        truncation=True,
        max_length=128,
        return_tensors="np",
    )
    available = {item.name for item in model.get_inputs()}
    model_inputs = {
        name: encoded[name].astype(np.int64)
        for name in available
        if name in encoded
    }
    outputs = model.run(None, model_inputs)
    if not outputs:
        raise RuntimeError("ONNX embedding model returned no outputs.")
    token_embeddings = np.asarray(outputs[0], dtype=np.float32)
    if token_embeddings.ndim != 3:
        raise RuntimeError(f"Unexpected ONNX embedding output shape: {token_embeddings.shape}")
    result = _mean_pooling(token_embeddings, encoded["attention_mask"])
    if NORMALIZE_EMBEDDINGS:
        result = _normalize(result)
    return result.astype(np.float32)


def _validate_embedding_array(embeddings, expected_count: int) -> np.ndarray:
    array = np.asarray(embeddings, dtype=np.float32)
    if array.ndim == 1:
        if expected_count == 1:
            array = array.reshape(1, -1)
        else:
            raise ValueError("Embedding output must be a 2-dimensional array.")
    if array.ndim != 2:
        raise ValueError("Embedding output must be a 2-dimensional array.")
    if array.shape[0] != expected_count:
        raise ValueError(
            f"Embedding count does not match input chunks. Expected {expected_count}, received {array.shape[0]}."
        )
    if array.shape[1] != EXPECTED_EMBEDDING_DIMENSION:
        raise ValueError(
            f"Unexpected embedding dimension. Expected {EXPECTED_EMBEDDING_DIMENSION}, received {array.shape[1]}."
        )
    if not np.isfinite(array).all():
        raise ValueError("Embeddings contain NaN or infinite values.")
    if np.any(np.linalg.norm(array, axis=1) == 0):
        raise ValueError("One or more embeddings are zero vectors.")
    return array


def generate_embeddings(chunks: Sequence[str]) -> List[List[float]]:
    cleaned = _validate_chunks(chunks)
    print(f"[Embedding] Generating embeddings for {len(cleaned)} chunk(s)...", flush=True)
    batches = []
    for start in range(0, len(cleaned), ENCODE_BATCH_SIZE):
        batch = cleaned[start:start + ENCODE_BATCH_SIZE]
        try:
            batches.append(_encode(batch))
        except Exception as error:
            print(f"[Embedding] Generation failed: {error!r}", flush=True)
            raise RuntimeError("Unable to generate document embeddings.") from error
    array = _validate_embedding_array(np.vstack(batches), len(cleaned))
    if NORMALIZE_EMBEDDINGS:
        norms = np.linalg.norm(array, axis=1, keepdims=True)
        array = array / np.maximum(norms, 1e-12)
    result = array.tolist()
    print(f"[Embedding] Successfully generated {len(result)} embedding(s).", flush=True)
    print(f"[Embedding] Dimension: {len(result[0])}", flush=True)
    return result


def generate_query_embedding(question: str) -> List[float]:
    question = _validate_text(question)
    print("[Embedding] Generating query embedding...", flush=True)
    try:
        array = np.asarray(_encode([question])[0], dtype=np.float32)
    except Exception as error:
        print(f"[Embedding] Query embedding failed: {error!r}", flush=True)
        raise RuntimeError("Unable to generate query embedding.") from error
    if array.ndim != 1:
        raise ValueError("Query embedding must be a 1-dimensional vector.")
    if len(array) != EXPECTED_EMBEDDING_DIMENSION:
        raise ValueError(
            f"Unexpected query embedding dimension. Expected {EXPECTED_EMBEDDING_DIMENSION}, received {len(array)}."
        )
    if not np.isfinite(array).all():
        raise ValueError("Query embedding contains NaN or infinite values.")
    norm = np.linalg.norm(array)
    if norm == 0:
        raise ValueError("Query embedding cannot be a zero vector.")
    if NORMALIZE_EMBEDDINGS:
        array = array / max(norm, 1e-12)
    print(f"[Embedding] Query embedding generated ({len(array)} dimensions).", flush=True)
    return array.tolist()


def get_embedding_dimension() -> int:
    return EXPECTED_EMBEDDING_DIMENSION


def get_embedding_model_name() -> str:
    return MODEL_NAME


def cosine_similarity(vector_a: Sequence[float], vector_b: Sequence[float]) -> float:
    a = np.asarray(vector_a, dtype=np.float32)
    b = np.asarray(vector_b, dtype=np.float32)
    if a.ndim != 1 or b.ndim != 1:
        raise ValueError("Both vectors must be 1-dimensional.")
    if a.shape != b.shape:
        raise ValueError("Both vectors must have the same dimension.")
    if len(a) != EXPECTED_EMBEDDING_DIMENSION or len(b) != EXPECTED_EMBEDDING_DIMENSION:
        raise ValueError(f"Both vectors must have dimension {EXPECTED_EMBEDDING_DIMENSION}.")
    if not np.isfinite(a).all() or not np.isfinite(b).all():
        raise ValueError("Vectors contain invalid values.")
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        raise ValueError("Vectors cannot be zero vectors.")
    return float(np.clip(np.dot(a, b) / (norm_a * norm_b), -1.0, 1.0))


def test_embedding() -> None:
    test_chunks = [
        "Software testing is the process of evaluating software to find defects.",
        "Verification checks whether the product is being built correctly.",
        "Validation checks whether the correct product is being built.",
    ]
    embeddings = generate_embeddings(test_chunks)
    query_embedding = generate_query_embedding("What is software verification?")
    print("Document embeddings:", len(embeddings))
    print("Embedding dimension:", len(embeddings[0]))
    print("Query dimension:", len(query_embedding))
    print("Verification:", f"{cosine_similarity(embeddings[1], query_embedding):.4f}")
    print("Validation:", f"{cosine_similarity(embeddings[2], query_embedding):.4f}")
    print("Testing:", f"{cosine_similarity(embeddings[0], query_embedding):.4f}")
    print("Single-chunk test:", "PASSED" if len(generate_embeddings(["This is a single document chunk."])) == 1 else "FAILED")


def get_embedding_info() -> dict:
    return {
        "model": MODEL_NAME,
        "dimension": EXPECTED_EMBEDDING_DIMENSION,
        "normalized": NORMALIZE_EMBEDDINGS,
        "batch_size": ENCODE_BATCH_SIZE,
        "provider": "onnxruntime",
        "model_loaded": _model is not None,
    }
