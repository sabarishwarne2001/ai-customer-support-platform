from sentence_transformers import SentenceTransformer
import chromadb
import uuid


embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_or_create_collection(
    name="pdf_chunks"
)


def create_embeddings(chunks):
    return embedding_model.encode(chunks)


def store_chunks(chunks,source):
    """
    Store chunks in ChromaDB
    """

    embeddings = create_embeddings(chunks)

    ids = []
    for _ in chunks:
        ids.append(str(uuid.uuid4()))

#         ids = [
#     str(uuid.uuid4())
#     for _ in chunks
# ]

    metadatas = []

    for chunk in chunks:
        metadatas.append(
        {
            "source": source
        }
    )

    # metadata=[
    # {"source": source} 
    # for _ in chunks
    # ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings.tolist(),
        metadatas=metadatas
    
    )

def search_chunks(query, n_results=2):
    """
    Retrieve the most relevant chunks.
    """

    query_embedding = embedding_model.encode(query)

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=n_results
    )

    return results

def clear_database():
    """
    Delete all stored chunks.
    """

    client.delete_collection("pdf_chunks")

    global collection

    collection = client.get_or_create_collection(
        name="pdf_chunks"
    )
def has_documents():

    count = collection.count()

    return count > 0

def document_exists(filename):
    """
    Check if a document with this filename
    already exists in the database.
    """

    results = collection.get(
        where={"source": filename}
    )

    return len(results["ids"]) > 0

def get_chunk_count():

    return collection.count()

def get_documents():
    """
    Return all unique document names
    stored in ChromaDB.
    """

    results = collection.get()

    documents = set()

    for metadata in results["metadatas"]:

        documents.add(
            metadata["source"]
        )

    return sorted(documents)

def delete_document(filename):
    """
    Delete all chunks belonging
    to one document.
    """

    collection.delete(
        where={
            "source": filename
        }
    )

def get_document_chunk_count(filename):
    """
    Return the number of chunks for one document.
    """

    results = collection.get(
        where={"source": filename}
    )

    return len(results["ids"])