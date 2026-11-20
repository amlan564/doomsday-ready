const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let code = err.code || "INTERNAL_SERVER_ERROR";

  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
    code = "DUPLICATE_RECORD";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
    code = "INVALID_ID";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Database validation failed";
    code = "VALIDATION_ERROR";
  }

  res.status(statusCode).json({
    success: false,
    code,
    message,
  });
};

export default errorHandler;
