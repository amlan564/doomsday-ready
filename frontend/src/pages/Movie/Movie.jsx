import { useEffect, useState } from "react";

import movieService from "@/services/movie-service";
import MovieForm from "@/pages/Movie/components/movie-form";
import MovieCard from "@/pages/Movie/components/movie-card";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await movieService.getAll();
        setMovies(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieAdded = (newMovie) => {
    setMovies((prev) => [...prev, newMovie]);
  };

  const handleWatchedChange = async (movieId, watched) => {
    setError("");

    try {
      await movieService.update(movieId, { watched });

      setMovies((prev) =>
        prev.map((movie) =>
          movie._id === movieId ? { ...movie, watched } : movie,
        ),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMovieUpdated = async () => {
    try {
      const response = await movieService.getAll();
      setMovies(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Movies</h1>
          <p className="text-muted-foreground">
            Manage your movies and prerequisites.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="cursor-pointer">+ Add Movie</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>

            <MovieForm
              movies={movies}
              onMovieAdded={handleMovieAdded}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your Movies</h2>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p className="text-muted-foreground">
            No movies found. Add your first movie.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                movies={movies}
                onWatchedChange={handleWatchedChange}
                onMovieUpdated={handleMovieUpdated}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Movie;
