import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import AppError from "../../utils/AppError";

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const customerId = req.user?.id;
  const orderId = req.body?.orderId;
  const result = await PaymentService.createCheckoutSession(
    customerId,
    orderId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Checkout completed",
    data: result,
  });
});

const handleStripeWebhook = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Missing Stripe signature.");
  }

  throw Error("Error pushed")

  await PaymentService.handleStripeWebhookEvent(req.body, signature as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Payment confirmed successfully",
    data: null,
  });
});

export const PaymentController = { createCheckoutSession, handleStripeWebhook };
