from typing import List, Dict, Any

def split_text_into_chunks(pages: List[Dict[str, Any]], document_id: int, chunk_size: int = 500, chunk_overlap: int = 50) -> List[Dict[str, Any]]:
    chunks = []
    chunk_idx = 0
    for page_data in pages:
        page_num = page_data.get("page", 1)
        text = page_data.get("text", "")
        if not text:
            continue
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk_slice = text[start:end]
            chunks.append({
                "document_id": document_id,
                "chunk_id": f"doc_{document_id}_p{page_num}_c{chunk_idx}",
                "chunk_index": chunk_idx,
                "page": page_num,
                "content": chunk_slice,
            })
            chunk_idx += 1
            start += (chunk_size - chunk_overlap)
    return chunks
