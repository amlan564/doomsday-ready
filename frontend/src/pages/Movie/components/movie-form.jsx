import { useState } from "react";
import movieService from "@/services/movie-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

function MovieForm({ movies, onMovieAdded, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    releaseYear: "",
    runtime: "",
    prerequisites: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrerequisiteChange = (movieId) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(movieId)
        ? prev.prerequisites.filter((id) => id !== movieId)
        : [...prev.prerequisites, movieId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await movieService.create({
        title: formData.title,
        releaseYear: Number(formData.releaseYear),
        runtime: Number(formData.runtime),
        prerequisites: formData.prerequisites,
      });

      onMovieAdded(response.data);

      setFormData({
        title: "",
        releaseYear: "",
        runtime: "",
        prerequisites: [],
      });

      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Movie Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter movie title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="releaseYear">Release Year</Label>
        <Input
          id="releaseYear"
          name="releaseYear"
          type="number"
          value={formData.releaseYear}
          onChange={handleChange}
          placeholder="Enter release year"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="runtime">Runtime (minutes)</Label>
        <Input
          id="runtime"
          name="runtime"
          type="number"
          min="1"
          max="300"
          value={formData.runtime}
          onChange={handleChange}
          placeholder="Enter runtime"
          required
        />
      </div>

      {movies.length > 0 && (
        <div className="space-y-2">
          <Label>Prerequisite Movies (Optional)</Label>

          <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
            {movies.map((movie) => (
              <div key={movie._id} className="flex items-center gap-2">
                <Checkbox
                  id={`prerequisite-${movie._id}`}
                  checked={formData.prerequisites.includes(movie._id)}
                  onCheckedChange={() => handlePrerequisiteChange(movie._id)}
                  className="cursor-pointer"
                />

                <Label
                  htmlFor={`prerequisite-${movie._id}`}
                  className="cursor-pointer"
                >
                  {movie.title}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading} size="lg" className="cursor-pointer">
        {loading ? "Adding Movie..." : "Add Movie"}
      </Button>
    </form>
  );
}

export default MovieForm;
