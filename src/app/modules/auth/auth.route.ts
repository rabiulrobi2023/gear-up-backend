import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import validationRequest from "../../middlewares/validationRequest";
import { loginValidationSchema, registerUserValidationSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validationRequest(registerUserValidationSchema),
  AuthController.registerUser,
);
router.post("/login",validationRequest(loginValidationSchema), AuthController.loginUser);
router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  AuthController.getMe,
);

export const authRouter = router;
