import { Router } from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import validationRequest from "../../middlewares/validationRequest";
import { createOrderValidationSchema } from "./order.validation";

const router = Router();
router.post(
  "/rentals",
  auth(Role.CUSTOMER),
  validationRequest(createOrderValidationSchema),
  OrderController.createOrder,
);
router.get("/rentals", auth(Role.CUSTOMER), OrderController.getOrders);
router.get("/rentals/:id", auth(Role.CUSTOMER), OrderController.getSingleOrder);
export const orderRouter = router;
