import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateCategory } from "./admin.interface";

const createCategoryIntoDB = async (payload: ICreateCategory) => {
  const name = payload.name.toLowerCase();
  const isCategoryExists = await prisma.categories.findUnique({
    where: { name },
  });

  if (isCategoryExists) {
    throw new AppError(StatusCodes.CONFLICT, "Category already exists");
  }
  const result = await prisma.categories.create({ data: { name } });
  return result;
};

export const AdminService = {
  createCategoryIntoDB,
};
