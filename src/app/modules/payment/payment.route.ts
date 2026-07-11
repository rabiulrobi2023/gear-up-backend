import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/create", PaymentController.createCheckoutSession)
router.post("/confirm", PaymentController.handleStripeWebhook)
export const paymentRoute = router;
