def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "AI Personalized Learning Companion"

def test_register_and_login(client):
    reg_payload = {"email": "student@example.com", "password": "securepassword123", "full_name": "Test Student"}
    reg_res = client.post("/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    data = reg_res.json()
    assert "access_token" in data
    token = data["access_token"]

    dup_res = client.post("/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    login_payload = {"email": "student@example.com", "password": "securepassword123"}
    login_res = client.post("/auth/login", json=login_payload)
    assert login_res.status_code == 200

    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "student@example.com"
