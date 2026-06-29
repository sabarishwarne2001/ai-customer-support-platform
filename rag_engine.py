from groq import Groq
from dotenv import load_dotenv
import os

from vector_store import search_chunks

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_rag(question):

    results = search_chunks(question)

    # Extract source PDFs
    sources = []

    for metadata in results["metadatas"][0]:

        sources.append(
            metadata["source"]
        )

    # Remove duplicate source names
    sources = list(
        set(sources)
    )

    source_text = "\n".join(
        sources
    )

    # Build context
    context = "\n\n".join(
        results["documents"][0]
    )


    prompt = f"""
You are a helpful AI assistant.

Use ONLY the provided document context when answering.

Document Context:
{context}

-------------------------

Current Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    answer = response.choices[0].message.content

    return f"""
{answer}

---
Source:
{source_text}
"""