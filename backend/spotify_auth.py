import httpx

CLIENT_ID = "your_client_id"
CLIENT_SECRET = "your_client_secret"

def get_spotify_access_token() -> str:
    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}

    response = httpx.post(url, headers=headers, data=data, auth=(CLIENT_ID, CLIENT_SECRET))

    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception(f"Failed to get access token: {response.text}")