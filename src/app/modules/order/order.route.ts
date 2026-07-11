import { Router } from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();
router.post("/rentals", auth(Role.CUSTOMER), OrderController.createOrder);
router.get("/rentals", auth(Role.CUSTOMER), OrderController.getOrders);
export const orderRouter = router;
