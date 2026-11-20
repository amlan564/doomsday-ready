import express from "express";

import {
  createMovie,
  getAllMovies,
  updateMovie,
  getMovieRewatchOrder,
} from "../controllers/movie-controller.js";

import validate from "../middleware/validate.js";

import {
  createMovieSchema,
  updateMovieSchema,
} from "../validations/movie-validation.js";

const router = express.Router();

router.post("/", validate(createMovieSchema), createMovie);

router.get("/", getAllMovies);

router.patch("/:id", validate(updateMovieSchema), updateMovie);

router.get("/:id/rewatch-order", getMovieRewatchOrder);

export default router;
