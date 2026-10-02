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
    omit: {
      createdAt: true,
      updatedAt: true,
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

const getMyGears = async (userId: string) => {
  const result = await prisma.items.findMany({
    where: {
      providerId: userId,
      isDeleted: false,
    },
    include: {
      category: { select: { id: true, name: true } },
      provider: { select: { name: true, email: true, phone: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: result,
    metadata: {},
  };
};

const getProviderOrders = async (providerId: string) => {
  const result = await prisma.orders.findMany({
    where: { item: { providerId } },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      item: {
        include: {
          provider: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          category: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    data: result,
  };
};

const getMyPendingOrdersFromDB = async (providerId: string) => {
  const result = await prisma.orders.findMany({
    where: {
      status: OrderStatus.PLACED,
      item: { providerId },
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      item: {
        include: {
          provider: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          category: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    data: result,
  };
};

const updateOrderStatusIntoDB = async (
  orderId: string,
  payload: IUpdateOrderStatus,
) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: { item: true },
  });
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  if (order?.status === OrderStatus.CANCELLED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "The order is cancelled");
  }

  if (order.status === OrderStatus.RETURNED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Gear already returned");
  }

  if (
    payload.status === OrderStatus.CANCELLED ||
    payload.status === OrderStatus.RETURNED
  ) {
    await prisma.$transaction(async (tx) => {
      const existingStock = order.item.stock;
      const orderedQuantity = order.quantity;
      const newStock = existingStock + orderedQuantity;

      const updateOrder = await tx.orders.update({
        where: { id: orderId },
        data: payload,
      });
      await tx.items.update({
        where: { id: order.itemId },
        data: { stock: newStock },
      });
      return updateOrder;
    });
  }

  const result = await prisma.orders.update({
    where: { id: orderId },
    data: payload,
  });
  return result;
};

const deleteGearFromDB = async (id: string, providerId: string) => {

  const isGearExist = await prisma.items.findUnique({
    where: { id, providerId, isDeleted: false },
  });
  if (!isGearExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Gear not found");
  }

  await prisma.items.update({
    where: { id, providerId },
    data: { isDeleted: true },
  });
  return null;
};

const getProviderItemStatistics = async (providerId: string) => {
  const [totalGears, activeGears, pendingGears] = await Promise.all([
    prisma.items.count({
      where: {
        providerId,
      },
    }),

    prisma.items.count({
      where: { providerId, stock: { gt: 0 } },
    }),

    prisma.orders.count({
      where: {
        status: OrderStatus.PLACED,
        item: {
          providerId,
        },
      },
    }),
  ]);

  return {
    totalGears,
    activeGears,
    pendingGears,
  };
};

export const ProviderService = {
  addItem,
  getMyGears,
  updateItem,
  getProviderOrders,
  getMyPendingOrdersFromDB,
  deleteGearFromDB,
  updateOrderStatusIntoDB,
  getProviderItemStatistics,
};
