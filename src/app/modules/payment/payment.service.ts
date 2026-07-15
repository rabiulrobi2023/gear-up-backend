import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import Stripe from "stripe";
import { PaymentMethod } from "../../../../generated/prisma/enums";

const createCheckoutSession = async (customerId: string, orderId: string) => {
  const order = await prisma.orders.findUnique({
    where: {
      id: orderId,
      customerId,
    },
    include: {
      customer: {
        select: { email: true },
      },
      item: {
        select: { name: true, id: true },
      },
    },
  });

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  if (order.status !== "PENDING") {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "This order is not available for payment.",
    );
  }

  if (order.expireAt < new Date()) {
    throw new AppError(
      StatusCodes.GONE,
      "The order has expired. Please make a new order",
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: order.customer.email,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          unit_amount: Number(order.dailyRate) * order.totalDays * 100,
          product_data: {
            name: order.item.name,
          },
        },
        quantity: order.quantity,
      },
    ],
    metadata: { orderId, itemId: order.item.id },
    success_url: config.STRIPE_PAYMENT_SUCCESS_URL,
    cancel_url: config.STRIPE_PAYMENT_CANCEL_URL,
    expires_at: Math.floor((Date.now() + 30 * 60 * 1000) / 1000),
  });

  return session.url;
};

const handleStripeWebhookEvent = async (payload: Buffer, signature: string) => {
  const webhookSecret = config.STRIPE_WEBHOOK_SECRET as string;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const gatewayTransactionId = session.payment_intent as string;

      if (session.payment_status !== "paid") {
        return;
      }

      if (!orderId) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          "Missing order id in session metadata",
        );
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(
        gatewayTransactionId,
        {
          expand: ["payment_method"],
        },
      );

      const stripeMethod = paymentIntent.payment_method as Stripe.PaymentMethod;

      let method: PaymentMethod;

      switch (stripeMethod.type) {
        case "card":
          method = PaymentMethod.CARD;
          break;
        case "us_bank_account":
        case "sepa_debit":
        case "bacs_debit":
          method = PaymentMethod.BANK;
          break;
        default:
          throw new Error("Unsupported payment method");
      }

      await prisma.$transaction(async (tx) => {
        await tx.orders.update({
          where: { id: orderId },
          data: {
            status: "CONFIRMED",
          },
        });

        await tx.payments.create({
          data: {
            orderId,
            gatewayTransactionId,
            amount: Number(session.amount_total) / 100,
            status: "PAID",
            method,
          },
        });
      });

      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const getAllPaymentsFromDB = async () => {
  const result = await prisma.payments.findMany({
    include: {
      order: {
        include: {
          customer: { select: { name: true, email: true } },
          item: {
            select: {
              name: true,
              brand: true,
              category: { select: { name: true } },
            },
          },
        },
      },
    },
  });
  return result;
};

const getSinglePaymentsByIdFromDB = async (id: string) => {
  const result = await prisma.payments.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: { omit: { password: true } },
          item: {
            select: {
              name: true,
              brand: true,
              provider: { select: { name: true } },
            },
          },
        },
      },
    },
  });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
  }
  return result;
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhookEvent,
  getAllPaymentsFromDB,
  getSinglePaymentsByIdFromDB,
};
