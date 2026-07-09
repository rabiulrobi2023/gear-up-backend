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

export const ProviderService = {
  addItem,
};
