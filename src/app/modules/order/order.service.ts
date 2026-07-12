import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateOrder } from "./order.interface";

const createOrderFromDB = async (customerId: string, payload: ICreateOrder) => {
  const isItemExists = await prisma.items.findUnique({
    where: { id: payload.itemId },
  });

  if (!isItemExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "Item not fount");
  }

  if (isItemExists.stock < 1) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This item is currently out of stock.",
    );
  }

  if (isItemExists.stock < payload.quantity) {
    throw new AppError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Requested quantity exceeds available stock.",
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (new Date(payload.startDate) < today) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Invalid start date. Start date must be greater than or equal to today",
    );
  }

  if (payload.returnDate < payload.startDate) {
    throw new AppError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Return date must be later than the start date.",
    );
  }

  const days = Math.max(
    Math.ceil(
      (new Date(payload.returnDate).valueOf() -
        new Date(payload.startDate).valueOf()) /
        (1000 * 60 * 60 * 24),
    ),
    1,
  );

  const result = await prisma.$transaction(async (tx) => {
    const dailyRate = Number(isItemExists.dailyRate);
    const totalAmount = dailyRate * payload.quantity * days;
    const expireAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const newStock = isItemExists.stock - Number(payload.quantity);

    await tx.items.update({
      where: { id: payload.itemId },
      data: { stock: newStock, isAvailable: newStock != 0 },
    });

    return await tx.orders.create({
      data: {
        ...payload,
        dailyRate,
        totalAmount,
        customerId,
        totalDays: days,
        expireAt,
      },
    });
  });

  return result;
};

const getAllOrdersFromDB = async (customerId: string) => {
  const result = await prisma.orders.findMany({
    where: { customerId: customerId },
    include: { item: true },
  });
  return result;
};

export const getSingleOrderFromDB = async (
  customerId: string,
  orderId: string,
) => {
  const result = await prisma.orders.findUnique({
    where: { customerId, id: orderId },
    include: { item: true },
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  return result;
};

export const OrderService = {
  createOrderFromDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
};
