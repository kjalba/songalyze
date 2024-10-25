from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

app = FastAPI(title=settings.PROJECT_NAME,version=settings.PROJECT_VERSION)

origins = [
    'http://localhost:3000',
    'http://localhost:5173',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

class SongBase(BaseModel):
    title: str
    artist: str
    chord_progression: str
    mood: str
    genre: str
    bpm: int
    lyrics: str

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


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/songs/", response_model=SongModel)
async def create_song(song: SongBase, db: db_dependency):
    db_song = models.Song(**song.model_dump())
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