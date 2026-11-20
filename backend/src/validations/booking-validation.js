import { z } from "zod";

export const bookingQuerySchema = z.object({
  groupSize: z
    .string()
    .regex(/^\d+$/, "Group size must be a valid number")
    .transform(Number)
    .pipe(
      z
        .number()
        .int("Group size must be an integer")
        .min(1, "Group size must be at least 1")
        .max(10000, "Group size cannot exceed 10000"),
    ),
});
