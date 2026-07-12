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

  await PaymentService.handleStripeWebhookEvent(req.body, signature as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Payment confirmed successfully",
    data: null,
  });
});

const getAllPayments = catchAsync(async (req, res, next) => {
  const result = await PaymentService.getAllPaymentsFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message:
      result.length > 0
        ? "Payments retrieved successfully"
        : "There is no any payments",
    data: result,
  });
});

const getSinglePaymentById = catchAsync(async (req, res, next) => {
  const paymentId = req.params.id;
  const result = await PaymentService.getSinglePaymentsByIdFromDB(
    paymentId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  createCheckoutSession,
  handleStripeWebhook,
  getAllPayments,
  getSinglePaymentById,
};
