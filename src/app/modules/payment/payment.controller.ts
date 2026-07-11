import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

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

const handleStripeWebhook = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const signature = req.headers["stripe-signature"];
  await PaymentService.handleStripeWebhookEvent(payload, signature as string);
});

export const PaymentController = { createCheckoutSession, handleStripeWebhook };
