import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import {
  IAddItem,
  IUpdateItem,
  IUpdateOrderStatus,
} from "./provider.interface";
import { OrderStatus } from "../../../../generated/prisma/enums";

const addItem = async (providerId: string, payload: IAddItem) => {
  const isCategoryExists = await prisma.categories.findUnique({
    where: { id: payload.categoryId },
  });

  if (!isCategoryExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const result = await prisma.items.create({
    data: {
      ...payload,
      providerId,
      isAvailable: payload.stock > 0 ? true : false,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const updateItem = async (
  itemId: string,
  providerId: string,
  payload: IUpdateItem,
) => {
  const isItemExist = await prisma.items.findUnique({
    where: {
      id: itemId,
      providerId,
    },
  });

  if (!isItemExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Item not found");
  }

  const isCategoryExists = await prisma.categories.findUnique({
    where: { id: payload.categoryId },
  });

  if (!isCategoryExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const result = await prisma.items.update({
    where: { id: itemId },
    data: { ...payload, isAvailable: payload.stock === 0 ? false : true },
    include: { category: { select: { name: true } } },
  });

  return result;
};

const getMyIncomingOrdersFromDB = async (providerId: string) => {
  const result = await prisma.orders.findMany({
    where: {
      status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
      item: { providerId },
    },
  });

  return result;
};

const updateOrderStatusIntoDB = async (
  orderId: string,
  payload: IUpdateOrderStatus,
) => {
  const order = await prisma.orders.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  if (order?.status === OrderStatus.CANCELLED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "The order is cancelled");
  }

  if (order.status === OrderStatus.RETURNED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Gear already returned");
  }

  const result = await prisma.orders.update({
    where: { id: orderId },
    data: payload,
  });
  return result;
};

const deleteGearFromDB = async (id: string) => {
  const isGearExist = await prisma.items.findUnique({ where: { id } });
  if (!isGearExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Gear not found");
  }

  const haveAnyOrderOfThisGear = await prisma.orders.findFirst();
  if (haveAnyOrderOfThisGear) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You cannot delete this gear, because it has already perched by customer",
    );
  }

  await prisma.items.delete({ where: { id } });
  return null;
};

export const ProviderService = {
  addItem,
  updateItem,
  getMyIncomingOrdersFromDB,
  deleteGearFromDB,
  updateOrderStatusIntoDB,
};
