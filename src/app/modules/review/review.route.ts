import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import validationRequest from "../../middlewares/validationRequest";
import { createOrderValidationSchema } from "../order/order.validation";
import { createReviewValidationSchema } from "./review.validation";

const router = Router();
router.post(
  "/reviews",
  auth(Role.CUSTOMER),
  validationRequest(createReviewValidationSchema),
  ReviewController.createReview,
);
export const reviewRouter = router;
