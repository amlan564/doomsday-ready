import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import EditMovieForm from "../../../pages/Movie/components/edit-movie-form";

function MovieCard({ movie, movies, onWatchedChange, onMovieUpdated }) {
  const [open, setOpen] = useState(false);

  const handleWatchedChange = (checked) => {
    onWatchedChange(movie._id, checked);
  };

  return (
    <div className="space-y-3 rounded-lg border bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{movie.title}</h3>

          <p className="text-sm text-muted-foreground">
            {movie.releaseYear} · {movie.runtime} minutes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`watched-${movie._id}`}
            checked={movie.watched}
            onCheckedChange={handleWatchedChange}
            className="cursor-pointer"
          />
          <Label htmlFor={`watched-${movie._id}`} className="cursor-pointer">
            Watched
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Prerequisite Movies</p>

        {movie.prerequisites?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {movie.prerequisites.map((prerequisite) => (
              <span
                key={prerequisite._id}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600"
              >
                {prerequisite.title}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No prerequisites</p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="cursor-pointer">
            Edit Prerequisites
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prerequisites</DialogTitle>
          </DialogHeader>

          <EditMovieForm
            movie={movie}
            movies={movies}
            onMovieUpdated={onMovieUpdated}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MovieCard;
