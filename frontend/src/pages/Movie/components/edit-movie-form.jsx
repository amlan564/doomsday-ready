import { useState } from "react";
import movieService from "@/services/movie-service";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function EditMovieForm({ movie, movies, onMovieUpdated, onClose }) {
  const [prerequisites, setPrerequisites] = useState(
    movie.prerequisites.map((prerequisite) =>
      typeof prerequisite === "string" ? prerequisite : prerequisite._id,
    ),
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableMovies = movies.filter((item) => item._id !== movie._id);

  const handlePrerequisiteChange = (movieId, checked) => {
    setPrerequisites((prev) =>
      checked ? [...prev, movieId] : prev.filter((id) => id !== movieId),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await movieService.update(movie._id, {
        prerequisites,
      });

      onMovieUpdated();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="font-medium">{movie.title}</p>
        <p className="text-sm text-muted-foreground">
          Select prerequisite movies
        </p>
      </div>

      <div className="max-h-60 space-y-3 overflow-y-auto rounded-md border p-3">
        {availableMovies.map((item) => (
          <div key={item._id} className="flex items-center gap-2">
            <Checkbox
              id={`prerequisite-${movie._id}-${item._id}`}
              checked={prerequisites.includes(item._id)}
              onCheckedChange={(checked) =>
                handlePrerequisiteChange(item._id, checked === true)
              }
              className="cursor-pointer"
            />

            <Label
              htmlFor={`prerequisite-${movie._id}-${item._id}`}
              className="cursor-pointer"
            >
              {item.title}
            </Label>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          size="lg"
          className="cursor-pointer"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="cursor-pointer"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

export default EditMovieForm;
