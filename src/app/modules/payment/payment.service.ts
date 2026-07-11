import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import Stripe from "stripe";

const createCheckoutSession = async (customerId: string, orderId: string) => {
  const order = await prisma.orders.findUnique({
    where: {
      id: orderId,
      customerId,
      status: "PENDING",
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
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: order.customer.email,
    line_items: [
      {
        price_data: {
          currency: "BDT",
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
  });

  return session.url;
};

const handleStripeWebhookEvent = async (payload: Buffer, signature: string) => {
  const webhookSecret = config.STRIPE_WEBHOOK_SECRET;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      console.log(orderId)
      console.log(session.payment_status)

      if (session.payment_status != "paid") {
        break;
      }
      if (!orderId) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          "Missing order id in session metadata",
        );
      }
      await prisma.orders.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
        },
      });

      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhookEvent,
};
