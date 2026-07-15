import z from "zod";

export const createReviewValidationSchema = z.object({
  orderId: z.string("Order id is required").trim(),
  itemId: z.string("Item id is required").trim(),
  rating: z
    .number("Rating is required")
    .min(1, "Review rating must be at least 1")
    .max(5, "Review rating must be maximum 5"),
  comment: z.string().optional()
});
