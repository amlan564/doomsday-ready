import { z } from "zod";

export const createCinemaSchema = z.object({
  name: z.string().trim().min(1, "Cinema name is required"),

  bundleSizes: z
    .array(
      z
        .number()
        .int("Bundle size must be an integer")
        .min(1, "Bundle size must be at least 1")
        .max(500, "Bundle size cannot exceed 500"),
    )
    .min(1, "At least one bundle size is required")
    .max(10, "You can provide at most 10 bundle sizes")
    .refine(
      (sizes) => new Set(sizes).size === sizes.length,
      "Bundle sizes must be unique",
    ),
});
