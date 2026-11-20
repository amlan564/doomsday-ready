import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().trim().min(1, "Movie title is required"),

  releaseYear: z.number().int("Release year must be an integer"),

  runtime: z
    .number()
    .int("Runtime must be an integer")
    .min(1, "Runtime must be at least 1 minute")
    .max(300, "Runtime cannot exceed 300 minutes"),

  prerequisites: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid movie ID"))
    .optional()
    .default([]),

  watched: z.boolean().optional().default(false),
});

export const updateMovieSchema = z
  .object({
    title: z.string().trim().min(1).optional(),

    releaseYear: z.number().int().optional(),

    runtime: z.number().int().min(1).max(300).optional(),

    prerequisites: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid movie ID"))
      .optional(),

    watched: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required for update",
  );
