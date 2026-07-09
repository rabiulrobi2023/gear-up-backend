import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateOrder } from "./order.interface";

const createOrder = async (
  customerId: string,
  itemId: string,
  payload: ICreateOrder,
) => {
  const isItemExists = await prisma.items.findUnique({ where: { id: itemId } });
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

  if (payload.returnDate < new Date()) {
    throw new AppError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Return date must be later than the start date.",
    );
  }

  const unitPrice = Number(isItemExists.price);
  const totalAmount = unitPrice * payload.quantity;

  const result = await prisma.orders.create({
    data: { ...payload, unitPrice, totalAmount, customerId },
  });

  return result;
};

export const OrderService = {
  createOrder,
};
