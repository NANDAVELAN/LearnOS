def get_auth_token(client, email="course_user@example.com"):
    res = client.post("/auth/register", json={"email": email, "password": "password123", "full_name": "Course Tester"})
    return res.json()["access_token"]

def test_courses_crud(client):
    token = get_auth_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    course_data = {"title": "Data Mining", "description": "20-day exam prep", "goal_days": 20, "hours_per_day": 2.0, "student_level": "Intermediate"}
    create_res = client.post("/courses", json=course_data, headers=headers)
    assert create_res.status_code == 201
    course_id = create_res.json()["id"]

    list_res = client.get("/courses", headers=headers)
    assert list_res.status_code == 200
    assert any(c["id"] == course_id for c in list_res.json())

    get_res = client.get(f"/courses/{course_id}", headers=headers)
    assert get_res.status_code == 200

    update_res = client.put(f"/courses/{course_id}", json={"goal_days": 25}, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["goal_days"] == 25

    del_res = client.delete(f"/courses/{course_id}", headers=headers)
    assert del_res.status_code == 204
    assert client.get(f"/courses/{course_id}", headers=headers).status_code == 404
