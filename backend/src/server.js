import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import movieRoutes from "./routes/movie-routes.js";
import cinemaRoutes from "./routes/cinema-routes.js";
import errorHandler from "./middleware/error-handler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/cinemas", cinemaRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Doomsday Ready API is running",
  });
});

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);

  error.statusCode = 404;
  error.code = "ROUTE_NOT_FOUND";

  next(error);
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
