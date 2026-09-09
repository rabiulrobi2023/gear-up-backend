import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateReview } from "./review.interface";
import { OrderStatus } from "../../../../generated/prisma/enums";

const createReview = async (customerId: string, payload: ICreateReview) => {
  const order = await prisma.orders.findFirst({
    where: {
      id: payload.orderId,
      customerId,
      itemId: payload.itemId,
      status: OrderStatus.RETURNED,
    },
  });

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  const existingReview = await prisma.reviews.findUnique({
    where: { orderId: payload.orderId },
  });

  if (existingReview) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Your have already reviewed this order",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const reviewRes = await tx.reviews.create({
      data: { ...payload, customerId },
    });
    await tx.orders.update({
      where: {
        id: payload.orderId,
      },
      data: { status: OrderStatus.COMPLETED },
    });
    return reviewRes;
  });
  return result;
};

export const ReviewService = {
  createReview,
};
