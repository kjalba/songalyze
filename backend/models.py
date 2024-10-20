from database import Base
from sqlalchemy import Column, Integer, String

class Song(Base):
    __tablename__ = "songs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String)
    chord_progression = Column(String)
    mood = Column(String)
    genre = Column(String)
    bpm = Column(Integer)
    lyrics = Column(String, nullable=True)