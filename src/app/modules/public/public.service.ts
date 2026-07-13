import { IPaginationOptions } from "./../../interface/interface";
import { StatusCodes } from "http-status-codes";
import { ItemsWhereInput } from "../../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import buildFilterableField from "../../utils/buildFilterableField";
import buildSearchCondition from "../../utils/buildSearchCondition";
import { itemfilterableFields, itemSearchableFields } from "./public.constant";
import { IItemQueryInput } from "./public.interface";
import calculatePagination from "../../utils/calculatePagination";

const getAllGearFromDB = async (query: IItemQueryInput) => {
  const {
    searchTerm,
    limit,
    page,
    sortBy,
    sortOrder,
    categoryName,
    minRate,
    maxRate,
    ...queryFilter
  } = query;

  const andConditions: ItemsWhereInput[] = [];
  const pagination = calculatePagination({
    page,
    limit,
    sortBy,
    sortOrder,
  } as IPaginationOptions);

  if (searchTerm?.trim()) {
    andConditions.push(buildSearchCondition(searchTerm, itemSearchableFields));
  }
  if (queryFilter) {
    andConditions.push(buildFilterableField(queryFilter, itemfilterableFields));
  }

  if (minRate) {
    andConditions.push({ dailyRate: { gte: minRate } });
  }
  if (maxRate) {
    andConditions.push({ dailyRate: { lte: maxRate } });
  }

  if (categoryName) {
    andConditions.push({ category: { name: categoryName } });
  }

  const result = await prisma.items.findMany({
    where: { AND: andConditions },
    include: {
      category: true,
      provider: { select: { name: true, email: true, phone: true } },
    },
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: { [pagination.sortBy]: pagination.sortOrder },
  });

  const total = await prisma.items.count({ where: { AND: andConditions } });
  return {
    result,
    metaData: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPage: Math.ceil(total / pagination.limit),
    },
  };
};

const getSingleGearFromDB = async (itemId: string) => {
  const result = await prisma.items.findUnique({
    where: { id: itemId },
    include: {
      category: { select: { name: true } },
      provider: {
        select: { name: true, address: true, email: true, phone: true },
      },
    },
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Gear not found");
  }

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.categories.findMany();
  return result;
};

export const PublicService = {
  getAllGearFromDB,
  getSingleGearFromDB,
  getAllCategoriesFromDB,
};
