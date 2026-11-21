import { useEffect, useState } from "react";

import movieService from "@/services/movie-service";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

const RewatchPlan = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rewatchPlan, setRewatchPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

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

  const handleGeneratePlan = async () => {
    if (!selectedMovie) return;

    setPlanLoading(true);
    setError("");
    setRewatchPlan(null);

    try {
      const response = await movieService.getRewatchOrder(selectedMovie);
      setRewatchPlan(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setPlanLoading(false);
    }
  };

  const handleWatchedChange = async (movieId, watched) => {
    setError("");

    try {
      await movieService.update(movieId, { watched });

      const response = await movieService.getRewatchOrder(selectedMovie);
      setRewatchPlan(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rewatch Plan</h1>
        <p className="text-muted-foreground">
          Select a target movie to generate your rewatch plan.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="max-w-md space-y-2">
        <Label htmlFor="targetMovie">Target Movie</Label>

        <Select
          value={selectedMovie}
          onValueChange={setSelectedMovie}
          disabled={loading || movies.length === 0}
        >
          <SelectTrigger id="targetMovie" className="w-full cursor-pointer">
            <SelectValue placeholder="Select a movie">
              {movies.find((movie) => movie._id === selectedMovie)?.title}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {movies.map((movie) => (
              <SelectItem
                key={movie._id}
                value={movie._id}
                className="cursor-pointer"
              >
                {movie.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleGeneratePlan}
          disabled={!selectedMovie || planLoading}
          size="lg"
          className="cursor-pointer"
        >
          {planLoading ? "Generating Plan..." : "Generate Plan"}
        </Button>

        {rewatchPlan && (
          <div className="space-y-6 rounded-lg border bg-white p-5">
            <div>
              <h2 className="text-xl font-semibold">
                Rewatch Plan for {rewatchPlan.targetMovie.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Watch the prerequisite movies in the following order.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {rewatchPlan.watchedCount} of {rewatchPlan.totalMovies}{" "}
                  watched
                </p>
              </div>

              <Progress
                value={
                  rewatchPlan.totalMovies > 0
                    ? (rewatchPlan.watchedCount / rewatchPlan.totalMovies) * 100
                    : 0
                }
              />
            </div>

            <div>
              <h3 className="font-medium">Remaining Watch Time</h3>
              <p className="text-xl font-bold">
                {rewatchPlan.unwatchedRuntime} minutes
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Movie Watch Order</h3>

              {rewatchPlan.movies.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No prerequisite movies. You can watch your target movie
                  directly.
                </p>
              ) : (
                rewatchPlan.movies.map((movie, index) => (
                  <div
                    key={movie._id}
                    className="flex items-center gap-3 rounded-md border p-3"
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}.
                    </span>

                    <Checkbox
                      id={`rewatch-${movie._id}`}
                      checked={movie.watched}
                      onCheckedChange={(checked) =>
                        handleWatchedChange(movie._id, checked === true)
                      }
                      className="cursor-pointer"
                    />

                    <Label
                      htmlFor={`rewatch-${movie._id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <span
                        className={
                          movie.watched
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {movie.title}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {movie.runtime} min
                      </span>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground">Loading movies...</p>
        )}

        {!loading && movies.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No movies available. Add movies first.
          </p>
        )}
      </div>
    </div>
  );
};

export default RewatchPlan;
