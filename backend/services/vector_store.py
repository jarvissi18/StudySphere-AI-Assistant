import chromadb
from typing import List
import numpy as np

# --------------------------------------------------
# ChromaDB Client
# --------------------------------------------------

client = chromadb.PersistentClient(path="chroma_db")


# --------------------------------------------------
# Get User Collection
# --------------------------------------------------

def get_collection(user_id: int):
    """
    Returns the ChromaDB collection for a specific user.
    """

    return client.get_or_create_collection(
        name=f"user_{user_id}_documents"
    )


# --------------------------------------------------
# Store Chunks
# --------------------------------------------------

def store_chunks(
    user_id: int,
    filename: str,
    chunks: List[str],
    embeddings: np.ndarray
):
    """
    Stores document chunks in ChromaDB.
    Existing chunks of the same PDF are removed first.
    """

    if not chunks:
        return 0

    if len(embeddings) == 0:
        return 0

    collection = get_collection(user_id)

    # Remove previous version of same PDF
    try:
        collection.delete(
            where={
                "filename": filename
            }
        )
    except Exception:
        pass

    ids = []
    metadatas = []

    for index, chunk in enumerate(chunks):

        ids.append(
            f"user_{user_id}_{filename}_chunk_{index}"
        )

        metadatas.append(
            {
                "filename": filename,
                "chunk_number": index + 1,
                "text_length": len(chunk),
                "user_id": user_id,
            }
        )

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist(),
        metadatas=metadatas,
    )

    return len(chunks)


# --------------------------------------------------
# Search Chunks
# --------------------------------------------------

def search_chunks(
    user_id: int,
    question_embedding,
    n_results: int = 10,
):
    """
    Searches relevant chunks from user's collection.
    """

    collection = get_collection(user_id)

    try:

        return collection.query(
            query_embeddings=[question_embedding.tolist()],
            n_results=n_results,
            include=[
                "documents",
                "metadatas",
                "distances",
            ],
        )

    except Exception:

        return {
            "documents": [[]],
            "metadatas": [[]],
            "distances": [[]],
        }


# --------------------------------------------------
# Delete PDF Embeddings
# --------------------------------------------------

def delete_pdf_embeddings(
    user_id: int,
    filename: str,
):
    """
    Deletes all embeddings of a specific PDF.
    """

    collection = get_collection(user_id)

    try:

        results = collection.get(
            where={
                "filename": filename
            }
        )

        ids = results.get("ids", [])

        if ids:
            collection.delete(ids=ids)

        return len(ids)

    except Exception:
        return 0


# --------------------------------------------------
# Collection Statistics
# --------------------------------------------------

def get_collection_stats(user_id: int):
    """
    Returns total number of chunks stored
    for a specific user.
    """

    collection = get_collection(user_id)

    try:

        data = collection.get()

        return {
            "total_chunks": len(data.get("ids", []))
        }

    except Exception:

        return {
            "total_chunks": 0
        }