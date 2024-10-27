from database import Base
from sqlalchemy import Column, Integer, String, ARRAY

class Song(Base):
    __tablename__ = "songs"
    id = Column(Integer, primary_key=True, index=True)
    track_name = Column(String, index=True)
    artist_name = Column(String)
    popularity = Column(Integer)
    genres = Column(ARRAY(String))  # Store multiple genres
    key = Column(String, nullable=True)  # Entered manually
    chord_progression = Column(String, nullable=True)  # Entered manually