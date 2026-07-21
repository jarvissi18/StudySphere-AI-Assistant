from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embeddings(chunks):

    return model.encode(
        chunks,
        normalize_embeddings=True,
        convert_to_numpy=True
    )


def generate_query_embedding(question):

    return model.encode(
        question,
        normalize_embeddings=True,
        convert_to_numpy=True
    )