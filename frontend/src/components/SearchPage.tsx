import { useEffect, useState } from 'react';
import axios from 'axios';

const SearchPage: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [artistQuery, setArtistQuery] = useState('');

  useEffect(() => {
    // Fetch genres from the backend
    axios.get('http://localhost:8000/genres/')
      .then((response) => setGenres(response.data))
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

  // Search for tracks by artist whenever artistQuery updates
  useEffect(() => {
    if (artistQuery) {
      searchTracksByArtist();
    }
  }, [artistQuery]);

  const searchArtistsByGenre = () => {
    axios.get(`http://localhost:8000/artists/?genre=${selectedGenre}`)
      .then((response) => setArtists(response.data))
      .catch((error) => console.error('Error searching artists:', error));
  };

  const searchTracksByArtist = () => {
    axios.get(`http://localhost:8000/tracks/?artist=${artistQuery}`)
      .then((response) => setTracks(response.data))
      .catch((error) => console.error('Error searching tracks:', error));
  };

  const handleArtistClick = (artistName: string) => {
    setArtistQuery(artistName);  // This triggers the search via useEffect
  };

  const addToFavorites = (track: any) => {
    const song = {
      track_name: track.name,
      artist_name: track.artists[0].name,
      popularity: track.popularity,
      genres: track.artists[0].genres || [],
    };
  
    axios.post('http://localhost:8000/favorites/', song, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => alert('Song added to favorites!'))
      .catch((error) => {
        console.error('Error adding to favorites:', error);
        alert('Failed to add song to favorites.');
      });
  };

  return (
    <div>
      <h2>Search for Tracks</h2>

      <div>
        <label>Search by Genre: </label>
        <input
          list="genres"
          placeholder="Select a genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        />
        <datalist id="genres">
          {genres.map((genre) => (
            <option key={genre} value={genre} />
          ))}
        </datalist>
        <button onClick={searchArtistsByGenre}>Search Artists</button>
      </div>

      <h3>Artists</h3>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            {artist.name}
            <button onClick={() => handleArtistClick(artist.name)}>
              Search Tracks
            </button>
          </li>
        ))}
      </ul>

      <h3>Tracks</h3>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            {track.name} - Popularity: {track.popularity}
            <button onClick={() => addToFavorites(track)}>Add to Favorites</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;