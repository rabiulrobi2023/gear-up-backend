import z, { email } from "zod";
import { Role } from "../../../../generated/prisma/enums";

export const registerUserValidationSchema = z.object({
  name: z.string({ error: "Name is required" }),
  email: z.email("Email is required"),
  password: z
    .string("Password is required")
    .min(6, "Password at least be six digit long"),
  role: z.enum(
    [Role.CUSTOMER, Role.PROVIDER],
    "Role is required and role must be CUSTOMER OR PROVIDER",
  ),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginValidationSchema = z.object({
  email: z.email("Email is required"),
  password: z
    .string("Password is required")
    .min(6, "Password at least six digit long"),
});
