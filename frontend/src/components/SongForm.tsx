import { useState } from 'react';
import { createSong } from '../api/songsApi';

const SongForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    chord_progression: '',
    mood: '',
    genre: '',
    bpm: 0,
    lyrics: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSong = await createSong(formData);
      alert(`Song "${newSong.title}" added successfully!`);
    } catch (error) {
      console.error('Error creating song:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="artist" placeholder="Artist" onChange={handleChange} />
      <input name="chord_progression" placeholder="Chord Progression" onChange={handleChange} />
      <input name="mood" placeholder="Mood" onChange={handleChange} />
      <input name="genre" placeholder="Genre" onChange={handleChange} />
      <input name="bpm" type="number" placeholder="BPM" onChange={handleChange} />
      <textarea name="lyrics" placeholder="Lyrics" onChange={handleChange}></textarea>
      <button type="submit">Add Song</button>
    </form>
  );
};

export default SongForm;