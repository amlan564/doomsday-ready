import api from "./api";

const movieService = {
  getAll: () => api.get("/movies"),

  create: (movieData) => api.post("/movies", movieData),

  update: (movieId, movieData) => api.patch(`/movies/${movieId}`, movieData),

  getRewatchOrder: (movieId) => api.get(`/movies/${movieId}/rewatch-order`),
};

export default movieService;
