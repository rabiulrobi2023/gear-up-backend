import { Router } from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.post("/create", PaymentController.createCheckoutSession);
router.get("/",auth(Role.ADMIN), PaymentController.getAllPayments);
router.get("/:id",auth(Role.ADMIN), PaymentController.getSinglePaymentById);
// router.post("/confirm", PaymentController.handleStripeWebhook)
export const paymentRoute = router;
