import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { IAddItem } from "./provider.interface";

const addItem = async (providerId: string, payload: IAddItem) => {
  const isCategoryExists = await prisma.categories.findUnique({
    where: { id: payload.categoryId },
  });

  if (!isCategoryExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const result = await prisma.items.create({
    data: { ...payload, providerId },
    include: {
      category: true,
    },
  });

  return result;
};

const updateItem = async (
  providerId: string,
  itemId: string,
  payload: IAddItem,
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
    data: payload,
    include: { category: { select: { name: true } } },
  });

  return result
};

export const ProviderService = {
  addItem,
  updateItem
};
