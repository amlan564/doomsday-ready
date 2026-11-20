import * as cinemaService from "../services/cinema-service.js";

export const createCinema = async (req, res, next) => {
  try {
    const cinema = await cinemaService.createCinema(req.body);

    res.status(201).json({
      success: true,
      message: "Cinema created successfully",
      data: cinema,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCinemas = async (req, res, next) => {
  try {
    const cinemas = await cinemaService.getAllCinemas();

    res.status(200).json({
      success: true,
      count: cinemas.length,
      data: cinemas,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingQuote = async (req, res, next) => {
  try {
    const result = await cinemaService.getBookingQuote(
      req.params.id,
      req.validatedQuery.groupSize,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
