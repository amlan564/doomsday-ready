import express from "express";

import {
  createCinema,
  getAllCinemas,
  getBookingQuote,
} from "../controllers/cinema-controller.js";

import validate from "../middleware/validate.js";

import { createCinemaSchema } from "../validations/cinema-validation.js";
import { bookingQuerySchema } from "../validations/booking-validation.js";

const router = express.Router();

router.post("/", validate(createCinemaSchema), createCinema);

router.get("/", getAllCinemas);

router.get(
  "/:id/booking",
  validate(bookingQuerySchema, "query"),
  getBookingQuote,
);

export default router;
