import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cinema name is required"],
      unique: true,
      trim: true,
    },

    bundleSizes: {
      type: [Number],
      required: [true, "Bundle sizes are required"],
    },
  },
  {
    timestamps: true,
  },
);

const Cinema = mongoose.model("Cinema", cinemaSchema);

export default Cinema;
