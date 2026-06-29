from pypdf import PdfReader

def extract_text_from_pdf(pdf_path):
    """
    Extract all text from a PDF file.
    """

    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:
        text += page.extract_text() + "\n"

    return text

def create_chunks(text, chunk_size=500):
    """
    Split text into smaller chunks.
    """

    chunks = []

    for i in range(0, len(text), chunk_size):
        chunk = text[i:i + chunk_size]
        chunks.append(chunk)

    return chunks