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
    throw new AppError(StatusCodes.NOT_FOUND, "Completed order not found");
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

  const result = await prisma.reviews.create({
    data: { ...payload, customerId },
  });

  return result;
};

export const ReviewService = {
  createReview,
};
