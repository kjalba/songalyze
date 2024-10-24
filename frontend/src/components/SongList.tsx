import { useEffect, useState } from 'react';
import { getSongs } from '../api/songsApi';

const SongList: React.FC = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getSongs();
        setSongs(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div>
      <h2>Song List</h2>
      <ul>
        {songs.map((song: any) => (
          <li key={song.id}>
            {song.title} by {song.artist} (Genre: {song.genre}, BPM: {song.bpm})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;