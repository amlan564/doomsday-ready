export const wouldCreateCircularDependency = (
  movies,
  movieId,
  prerequisiteIds,
) => {
  const targetId = movieId.toString();

  const movieMap = new Map(
    movies.map((movie) => [movie._id.toString(), movie]),
  );

  const hasPathToTarget = (currentId, visited = new Set()) => {
    if (currentId === targetId) {
      return true;
    }

    if (visited.has(currentId)) {
      return false;
    }

    visited.add(currentId);

    const currentMovie = movieMap.get(currentId);

    if (!currentMovie) {
      return false;
    }

    return currentMovie.prerequisites.some((prerequisiteId) =>
      hasPathToTarget(prerequisiteId.toString(), visited),
    );
  };

  return prerequisiteIds.some((prerequisiteId) =>
    hasPathToTarget(prerequisiteId.toString()),
  );
};

export const getRewatchOrder = (movies, targetId) => {
  const targetMovieId = targetId.toString();

  const movieMap = new Map(
    movies.map((movie) => [movie._id.toString(), movie]),
  );

  const visited = new Set();
  const visiting = new Set();
  const orderedMovies = [];

  const dfs = (movieId) => {
    if (visited.has(movieId)) {
      return;
    }

    if (visiting.has(movieId)) {
      const error = new Error("Circular dependency detected");
      error.statusCode = 409;
      error.code = "CIRCULAR_DEPENDENCY";
      throw error;
    }

    const movie = movieMap.get(movieId);

    if (!movie) {
      const error = new Error("Prerequisite movie not found");
      error.statusCode = 404;
      error.code = "PREREQUISITE_NOT_FOUND";
      throw error;
    }

    visiting.add(movieId);

    for (const prerequisiteId of movie.prerequisites) {
      dfs(prerequisiteId.toString());
    }

    visiting.delete(movieId);
    visited.add(movieId);

    if (movieId !== targetMovieId) {
      orderedMovies.push(movie);
    }
  };

  dfs(targetMovieId);

  const watchedCount = orderedMovies.filter((movie) => movie.watched).length;

  const unwatchedRuntime = orderedMovies
    .filter((movie) => !movie.watched)
    .reduce((total, movie) => total + movie.runtime, 0);

  return {
    movies: orderedMovies,
    watchedCount,
    totalMovies: orderedMovies.length,
    unwatchedRuntime,
  };
};
