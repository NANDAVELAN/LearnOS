import io

def get_auth_token(client, email="doc_user@example.com"):
    res = client.post("/auth/register", json={"email": email, "password": "password123", "full_name": "Document Tester"})
    return res.json()["access_token"]

def test_upload_and_list_document(client):
    token = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    course_res = client.post("/courses", json={"title": "Algorithms", "goal_days": 10}, headers=headers)
    course_id = course_res.json()["id"]

    pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [3 0 R]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n190\n%%EOF"
    files = {"file": ("test_syllabus.pdf", io.BytesIO(pdf_content), "application/pdf")}
    data = {"course_id": str(course_id)}

    upload_res = client.post("/documents/upload", files=files, data=data, headers=headers)
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    assert doc_data["filename"] == "test_syllabus.pdf"
    assert doc_data["course_id"] == course_id

    list_res = client.get(f"/documents?course_id={course_id}", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    bad_files = {"file": ("bad_file.txt", io.BytesIO(b"Hello world"), "text/plain")}
    bad_res = client.post("/documents/upload", files=bad_files, data=data, headers=headers)
    assert bad_res.status_code == 400
