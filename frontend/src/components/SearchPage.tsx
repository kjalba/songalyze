import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";

const SearchPage: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [artistQuery, setArtistQuery] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/genres/")
      .then((response) => setGenres(response.data))
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  useEffect(() => {
    if (artistQuery) {
      searchTracksByArtist();
    }
  }, [artistQuery]);

  const searchArtistsByGenre = () => {
    axios.get(`http://localhost:8000/artists/?genre=${selectedGenre}`)
      .then((response) => setArtists(response.data))
      .catch((error) => console.error("Error searching artists:", error));
  };

  const searchTracksByArtist = () => {
    axios.get(`http://localhost:8000/tracks/?artist=${artistQuery}`)
      .then((response) => setTracks(response.data))
      .catch((error) => console.error("Error searching tracks:", error));
  };

  const addToFavorites = (track: any) => {
    const song = {
      track_name: track.name,
      artist_name: track.artists[0].name,
      popularity: track.popularity,
      genres: track.artists[0].genres || [],
    };

    axios.post("http://localhost:8000/favorites/", song, {
      headers: { "Content-Type": "application/json" },
    })
      .then(() => alert("Song added to favorites!"))
      .catch((error) => console.error("Error adding to favorites:", error));
  };

  return (
    <div className="container mx-auto px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">Search for Tracks</h2>
      <div className="flex items-center gap-4 mb-8">
        <Input
          list="genres"
          placeholder="Select a genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="flex-grow"
        />
        <datalist id="genres">
          {genres.map((genre) => (
            <option key={genre} value={genre} />
          ))}
        </datalist>
        <Button onClick={searchArtistsByGenre}>Search Artists</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {artists.map((artist) => (
          <Card key={artist.id} className="p-6 shadow-md w-full">
            <CardHeader>
              <CardTitle>{artist.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setArtistQuery(artist.name)}>
                Search Tracks
              </Button>
            </CardFooter>
          </Card>
        ))}

        {tracks.map((track) => (
          <Card key={track.id}>
            <CardFooter>
              <p>{track.name} - Popularity: {track.popularity}</p>
              <Button onClick={() => addToFavorites(track)}>
                Add to Favorites
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;