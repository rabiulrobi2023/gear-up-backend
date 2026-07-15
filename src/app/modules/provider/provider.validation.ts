import z from "zod";
import { OrderStatus } from "../../../../generated/prisma/enums";

export const addItemValidationSchema = z
  .object({
    name: z
      .string("Name is required and must be string")
      .trim()
      .min(3, "Name must be at least 3 characters long"),
    brand: z
      .string()
      .trim()
      .min(2, "Brand name must be at least 2 characters long")
      .optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    categoryId: z.string("Category is required"),
    dailyRate: z
      .number("Daily rate is required")
      .gt(0, "Daily rate must be greater than 0"),
    stock: z.number("Stock is required").gt(0, "Stock must be greater than 0"),
  })
  .strict();

export const updateItemValidationSchema = z
  .object({
    name: z
      .string("Name is required and must be string")
      .trim()
      .min(3, "Name must be at least 3 characters long")
      .optional(),
    bran: z
      .string()
      .trim()
      .min(2, "Brand name must be at least 2 characters long")
      .optional(),
    image: z.string().optional(),
    categoryId: z.string("Category is required").optional(),
    dailyRate: z
      .number("Daily rate is required")
      .gt(0, "Daily rate must be greater than 0")
      .optional(),
    stock: z
      .number("Stock is required")
      .gte(0, "Stock must be positive number")
      .optional(),
  })
  .strict();

export const updateOrderStatusSchema = z.object({
  status: z.enum(Object.keys(OrderStatus)),
});
