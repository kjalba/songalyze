from fastapi import FastAPI, HTTPException, Depends, Query, Body
from typing import Annotated, List, Dict, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
import httpx
from spotify_auth import get_spotify_access_token
from sqlalchemy.exc import IntegrityError
import logging

app = FastAPI(title=settings.PROJECT_NAME,version=settings.PROJECT_VERSION)

origins = [
    'http://localhost:3000',
    'http://localhost:5173',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "OPTIONS", "PUT"],
    allow_headers=["Content-Type", "Authorization"],
)

class SongBase(BaseModel):
      track_name: str
      artist_name: str
      popularity: int
      genres: List[str]  # Default from artist but overrideable
      key: Optional[str] = None  # Manually entered key (e.g., "D Major")
      chord_progression: Optional[str] = None  # Manually entered chord progression

class SongModel(SongBase):
    id: int

    class Config:
        from_attributes = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SPOTIFY_API_BASE = "https://api.spotify.com/v1"

def get_spotify_headers() -> Dict[str, str]:
    token = get_spotify_access_token()
    return {"Authorization": f"Bearer {token}"}


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/songs/", response_model=SongModel)
async def create_song(song: SongBase, db: db_dependency):
    db_song = models.Song(**song.model_dump())
    db.add(db_song)
    db.commit()
    db.refresh(db_song)
    return db_song


@app.post("/favorites/", response_model=SongModel)
async def add_favorite_song(db: db_dependency, song: SongBase = Body(...)):
    # Check if the song already exists in the database
    existing_song = (
        db.query(models.Song)
        .filter(models.Song.track_name == song.track_name)
        .filter(models.Song.artist_name == song.artist_name)
        .first()
    )
    if existing_song:
        raise HTTPException(status_code=400, detail="Song already exists in favorites")

    # If not, add the new song
    db_song = models.Song(
        track_name=song.track_name,
        artist_name=song.artist_name,
        popularity=song.popularity,
        genres=song.genres,
    )
    db.add(db_song)
    db.commit()
    db.refresh(db_song)
    return db_song

@app.get("/songs/", response_model=List[SongModel])
async def get_songs(db: db_dependency, genre: str = None, limit: int = 100):
    query = db.query(models.Song)
    if genre:
        query = query.filter(models.Song.genre == genre)
    songs = query.limit(limit).all()
    return songs

@app.get("/favorites/", response_model=List[SongModel])
async def get_favorites(db: db_dependency, genre: str = Query(None)):
    query = db.query(models.Song)
    
    if genre:
        query = query.filter(models.Song.genres.any(genre))
    
    songs = query.all()
    return songs

@app.get("/search/", response_model=List[Dict])
async def search_spotify(
    q: str = Query(..., description="Search query"),
    type: str = Query("track", description="Search type: artist, album, or track"),
    limit: int = 10
):
    headers = get_spotify_headers()
    params = {
        "q": q,
        "type": type,
        "limit": limit
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPOTIFY_API_BASE}/search", headers=headers, params=params)

    if response.status_code == 200:
        return response.json()[f"{type}s"]["items"]
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch results")

@app.get("/genres/", response_model=List[str])
async def get_genres():
    headers = get_spotify_headers()
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPOTIFY_API_BASE}/recommendations/available-genre-seeds", headers=headers)

    if response.status_code == 200:
        return response.json().get("genres", [])
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch genres")
    
@app.get("/artists/", response_model=List[Dict])
async def get_artists_by_genre(genre: str = Query(..., description="Genre to search for"), limit: int = 10):
    headers = get_spotify_headers()
    params = {
        "q": f"genre:{genre}",
        "type": "artist",
        "limit": limit
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPOTIFY_API_BASE}/search", headers=headers, params=params)

    if response.status_code == 200:
        return response.json()["artists"]["items"]
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch artists")
    
@app.get("/tracks/", response_model=List[Dict])
async def search_tracks(
    artist: str = Query(..., description="Artist name"), limit: int = 10
):
    headers = get_spotify_headers()
    params = {
        "q": f"artist:{artist}",
        "type": "track",
        "limit": limit
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPOTIFY_API_BASE}/search", headers=headers, params=params)

    if response.status_code == 200:
        return response.json()["tracks"]["items"]
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch tracks")
    
@app.put("/songs/{id}", response_model=SongModel)
async def update_song(
    id: int, 
    key: Optional[str] = Body(None), 
    chord_progression: Optional[str] = Body(None), 
    db: Session = Depends(get_db)  # Directly use Depends()
):
    logging.info(f"Received PUT request for song {id} with key={key}, chord_progression={chord_progression}")

    song = db.query(models.Song).filter(models.Song.id == id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    # Update fields only if provided
    if key:
        song.key = key
    if chord_progression:
        song.chord_progression = chord_progression

    db.commit()
    db.refresh(song)
    return song