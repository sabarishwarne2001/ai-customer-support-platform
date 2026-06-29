import os

UPLOAD_FOLDER = "uploads"


def get_uploaded_documents():
    """
    Returns all uploaded PDF filenames.
    """

    if not os.path.exists(UPLOAD_FOLDER):
        return []

    return [
        file
        for file in os.listdir(UPLOAD_FOLDER)
        if file.endswith(".pdf")
    ]

def get_document_count():

    return len(get_uploaded_documents())

def delete_uploaded_document(filename):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    if os.path.exists(file_path):
        os.remove(file_path)