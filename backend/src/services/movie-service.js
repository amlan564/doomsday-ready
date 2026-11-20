import Movie from "../models/Movie.js";
import {
  wouldCreateCircularDependency,
  getRewatchOrder,
} from "../algorithms/rewatch-algorithm.js";

const createError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;

  return error;
};

const checkDuplicateTitle = async (title, excludeId = null) => {
  const query = {
    title: {
      $regex: `^${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingMovie = await Movie.findOne(query);

  if (existingMovie) {
    throw createError(
      "A movie with this title already exists",
      409,
      "DUPLICATE_MOVIE",
    );
  }
};

const checkPrerequisites = async (prerequisiteIds) => {
  const uniqueIds = [...new Set(prerequisiteIds.map(String))];

  if (uniqueIds.length !== prerequisiteIds.length) {
    throw createError(
      "Duplicate prerequisites are not allowed",
      400,
      "DUPLICATE_PREREQUISITE",
    );
  }

  const existingMovies = await Movie.find({
    _id: { $in: prerequisiteIds },
  });

  if (existingMovies.length !== uniqueIds.length) {
    throw createError(
      "One or more prerequisite movies were not found",
      404,
      "PREREQUISITE_NOT_FOUND",
    );
  }
};

export const createMovie = async (movieData) => {
  await checkDuplicateTitle(movieData.title);

  await checkPrerequisites(movieData.prerequisites);

  const movie = await Movie.create(movieData);

  return movie;
};

export const getAllMovies = async () => {
  const movies = await Movie.find()
    .populate("prerequisites", "title releaseYear runtime watched")
    .sort({ releaseYear: 1 });

  return movies;
};

export const updateMovie = async (movieId, updateData) => {
  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw createError("Movie not found", 404, "MOVIE_NOT_FOUND");
  }

  if (updateData.title !== undefined) {
    await checkDuplicateTitle(updateData.title, movieId);
  }

  if (updateData.prerequisites !== undefined) {
    await checkPrerequisites(updateData.prerequisites);

    const allMovies = await Movie.find();

    const hasCircularDependency = wouldCreateCircularDependency(
      allMovies,
      movieId,
      updateData.prerequisites,
    );

    if (hasCircularDependency) {
      throw createError(
        "Circular movie dependency detected",
        409,
        "CIRCULAR_DEPENDENCY",
      );
    }
  }

  Object.assign(movie, updateData);

  await movie.save();

  return movie;
};

export const getMovieRewatchOrder = async (movieId) => {
  const targetMovie = await Movie.findById(movieId);

  if (!targetMovie) {
    throw createError("Movie not found", 404, "MOVIE_NOT_FOUND");
  }

  const allMovies = await Movie.find();

  const result = getRewatchOrder(allMovies, movieId);

  return {
    targetMovie: {
      id: targetMovie._id,
      title: targetMovie.title,
    },
    ...result,
  };
};
