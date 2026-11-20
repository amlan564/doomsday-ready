import Cinema from "../models/Cinema.js";
import { getOptimalBundleQuote } from "../algorithms/booking-algorithm.js";

const createError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;

  return error;
};

export const createCinema = async (cinemaData) => {
  const escapedName = cinemaData.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingCinema = await Cinema.findOne({
    name: { $regex: `^${escapedName}$`, $options: "i" },
  });

  if (existingCinema) {
    throw createError(
      "A cinema with this name already exists",
      409,
      "DUPLICATE_CINEMA",
    );
  }

  const cinema = await Cinema.create(cinemaData);

  return cinema;
};

export const getAllCinemas = async () => {
  const cinemas = await Cinema.find().sort({ name: 1 });

  return cinemas;
};

export const getBookingQuote = async (cinemaId, groupSize) => {
  const cinema = await Cinema.findById(cinemaId);

  if (!cinema) {
    throw createError("Cinema not found", 404, "CINEMA_NOT_FOUND");
  }

  const quote = getOptimalBundleQuote(cinema.bundleSizes, groupSize);

  return {
    cinema: {
      id: cinema._id,
      name: cinema.name,
      bundleSizes: cinema.bundleSizes,
    },
    ...quote,
  };
};
