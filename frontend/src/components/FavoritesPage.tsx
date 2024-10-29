import { useEffect, useState } from 'react';
import axios from 'axios';

interface Song {
  id: number;
  track_name: string;
  artist_name: string;
  popularity: number;
  key: string;
  chord_progression: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null); // Track which song is being edited
  const [editData, setEditData] = useState<{ key: string; chord_progression: string }>({
    key: '',
    chord_progression: '',
  });

  // Fetch favorite songs
  useEffect(() => {
    axios.get('http://localhost:8000/favorites/')
      .then((response) => setFavorites(response.data))
      .catch((error) => console.error('Error fetching favorites:', error));
  }, []);

  // Handle input changes in edit mode
  const handleInputChange = (field: 'key' | 'chord_progression', value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Start editing a song
  const startEditing = (song: Song) => {
    setEditingId(song.id);
    setEditData({ key: song.key || '', chord_progression: song.chord_progression || '' });
  };

  // Save changes to the song
  const saveChanges = (id: number) => {
    axios.put(
      `http://localhost:8000/songs/${id}`,
      editData,
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(() => {
        setFavorites((prev) =>
          prev.map((song) =>
            song.id === id ? { ...song, ...editData } : song
          )
        );
        setEditingId(null); // Exit edit mode
      })
      .catch((error) => console.error('Error saving song:', error));
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h2>Your Favorite Songs</h2>
      <ul>
        {favorites.map((song) => (
          <li key={song.id} style={{ marginBottom: '10px' }}>
            <strong>{song.track_name}</strong> by {song.artist_name} (Popularity: {song.popularity})

            {editingId === song.id ? (
              <div>
                <input
                  placeholder="Key"
                  value={editData.key}
                  onChange={(e) => handleInputChange('key', e.target.value)}
                />
                <input
                  placeholder="Chord Progression"
                  value={editData.chord_progression}
                  onChange={(e) => handleInputChange('chord_progression', e.target.value)}
                />
                <button onClick={() => saveChanges(song.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>Key: {song.key || 'N/A'}</p>
                <p>Chord Progression: {song.chord_progression || 'N/A'}</p>
                <button onClick={() => startEditing(song)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;