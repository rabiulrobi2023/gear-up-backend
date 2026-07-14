import z from "zod";
const today = new Date()
today.setHours(0,0,0,0)

export const createOrderValidationSchema = z.object({
  itemId: z.string("Item id is required").trim(),
  quantity: z
    .number("Quantity is required")
    .min(1, "At least one item is required"),
  startDate: z.coerce.date("Start date is required").min(today,"Start date cannot be in the past"),
  returnDate: z.coerce.date("Return date is required "),
});
