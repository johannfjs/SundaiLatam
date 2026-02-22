from pathlib import Path

from langchain_community.document_loaders import PyMuPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from backend.rag.vectorstore import get_vectorstore


def ingest_file(file_path: Path) -> int:
    """Load a PDF or text file, chunk it, and upsert into ChromaDB.

    Returns the number of chunks added.
    """
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        loader = PyMuPDFLoader(str(file_path))
    else:
        loader = TextLoader(str(file_path), encoding="utf-8")

    documents = loader.load()

    for doc in documents:
        doc.metadata["source_file"] = file_path.name
        doc.metadata["file_type"] = suffix.lstrip(".")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", ". ", " "],
        add_start_index=True,
    )
    chunks = splitter.split_documents(documents)

    vs = get_vectorstore()
    ids = vs.add_documents(chunks)
    return len(ids)


def ingest_directory(directory: Path) -> dict[str, int]:
    """Ingest all PDFs and text files in a directory.

    Returns a mapping of filename → chunk count.
    """
    results: dict[str, int] = {}
    for path in sorted(directory.iterdir()):
        if path.suffix.lower() in {".pdf", ".txt", ".md"}:
            count = ingest_file(path)
            results[path.name] = count
    return results
