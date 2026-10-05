from pathlib import Path
from typing import List, Dict, Any

def extract_text_from_pdf(file_path: str) -> List[Dict[str, Any]]:
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found at: {file_path}")
    pages = []
    try:
        import fitz
        doc = fitz.open(str(path))
        for page_idx in range(len(doc)):
            page = doc[page_idx]
            text = page.get_text()
            pages.append({"page": page_idx + 1, "text": text.strip()})
        doc.close()
    except ImportError:
        pages.append({"page": 1, "text": "PyMuPDF not installed in environment."})
    return pages
