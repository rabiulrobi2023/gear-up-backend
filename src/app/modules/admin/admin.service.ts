import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import {
  ICreateCategory,
  IUpdateUserStatus,
  IUserWhereInput,
} from "./admin.interface";

import calculatePagination from "../../utils/calculatePagination";
import { IMetaData, IPaginationOptions } from "../../interface/interface";
import buildSearchCondition from "../../utils/buildSearchCondition";
import {
  userSearchableEnumAndNumericField,
  userSearchableFields,
} from "./admin.constant";
import { UserWhereInput } from "../../../../generated/prisma/models";
import { IItemQueryInput } from "../public/public.interface";
import { UserStatus } from "../../../../generated/prisma/enums";

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

const getAllUser = async (query: IUserWhereInput) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const pagination = calculatePagination({
    page,
    limit,
    sortBy,
    sortOrder,
  } as IPaginationOptions);

  const andConditions: UserWhereInput[] = [];

  if (searchTerm?.trim()) {
    const searchCondition = buildSearchCondition<UserWhereInput>(
      searchTerm.trim(),
      userSearchableFields,
      userSearchableEnumAndNumericField,
    );

    andConditions.push(searchCondition);
  }

  const result = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },
    omit: {
      password: true,
    },
    skip: pagination.skip,
    take: pagination.limit,
    orderBy: { [pagination.sortBy]: pagination.sortOrder },
  });

  const total = await prisma.user.count({ where: { AND: andConditions } });
  const totalPage = Math.ceil(total / pagination.limit);
  return {
    data: result,
    metaData: {
      page: pagination.page,
      limit: pagination.limit,
      skip: pagination.skip,
      total,
      totalPage,
    } as IMetaData,
  };
};

const getAllOrder = async () => {
  const result = await prisma.orders.findMany();
  return result;
};

const updateUserStatus = async (
  id: string,
  selfId: string,
  payload: IUpdateUserStatus,
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.status === payload.status) {
    throw new AppError(StatusCodes.CONFLICT, `User already ${payload.status}`);
  }

  if (id === selfId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You cannot cancel your own account",
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    omit: {
      password: true,
    },
  });
  return result;
};

export const AdminService = {
  createCategoryIntoDB,
  getAllUser,
  getAllOrder,
  updateUserStatus,
};
