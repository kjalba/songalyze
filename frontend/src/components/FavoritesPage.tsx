import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash, Pencil, Save, X } from "lucide-react";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ key: "", chord_progression: "" });

  useEffect(() => {
    axios.get("http://localhost:8000/favorites/")
      .then((response) => setFavorites(response.data))
      .catch((error) => console.error("Error fetching favorites:", error));
  }, []);

  const handleInputChange = (field: "key" | "chord_progression", value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const startEditing = (song: Song) => {
    setEditingId(song.id);
    setEditData({ key: song.key || "", chord_progression: song.chord_progression || "" });
  };

  const saveChanges = (id: number) => {
    axios.put(`http://localhost:8000/songs/${id}`, editData, {
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        setFavorites((prev) =>
          prev.map((song) => (song.id === id ? { ...song, ...editData } : song))
        );
        setEditingId(null);
      })
      .catch((error) => console.error("Error saving song:", error));
  };

  const deleteSong = (id: number) => {
    axios.delete(`http://localhost:8000/songs/${id}`)
      .then(() => setFavorites((prev) => prev.filter((song) => song.id !== id)))
      .catch((error) => console.error("Error deleting song:", error));
  };

  return (
    <div className="container mx-auto px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">Your Favorite Songs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {favorites.map((song) => (
          <Card key={song.id} className="p-6 shadow-md w-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{song.track_name}</CardTitle>
              <p className="text-muted-foreground">{song.artist_name}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Popularity: {song.popularity}</p>
              {editingId === song.id ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Key"
                    value={editData.key}
                    onChange={(e) => handleInputChange("key", e.target.value)}
                  />
                  <Input
                    placeholder="Chord Progression"
                    value={editData.chord_progression}
                    onChange={(e) => handleInputChange("chord_progression", e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <p>Key: {song.key || "N/A"}</p>
                  <p>Chord Progression: {song.chord_progression || "N/A"}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {editingId === song.id ? (
                <>
                  <Button onClick={() => saveChanges(song.id)}>
                    <Save className="mr-2 h-5 w-5" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    <X className="mr-2 h-5 w-5" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => startEditing(song)}>
                    <Pencil className="mr-2 h-5 w-5" />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => deleteSong(song.id)}>
                    <Trash className="mr-2 h-5 w-5" />
                    Delete
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;