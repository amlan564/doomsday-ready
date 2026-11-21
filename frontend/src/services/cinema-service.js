import api from "./api";

const cinemaService = {
  getAll: () => api.get("/cinemas"),

  create: (cinemaData) => api.post("/cinemas", cinemaData),

  getBookingQuote: (cinemaId, groupSize) =>
    api.get(`/cinemas/${cinemaId}/booking?groupSize=${groupSize}`),
};

export default cinemaService;
