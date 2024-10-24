import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getSongs = async (genre?: string) => {
  const response = await api.get(`/songs/${genre || ''}`);
  return response.data;
};

export const createSong = async (song: {
  title: string;
  artist: string;
  chord_progression: string;
  mood: string;
  genre: string;
  bpm: number;
  lyrics: string;
}) => {
  const response = await api.post('/songs/', song);
  return response.data;
};

export default api;