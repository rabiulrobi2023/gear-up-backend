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
import { userSearchableFields } from "./admin.constant";
import { UserWhereInput } from "../../../../generated/prisma/models";

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
    const searchCondition = <UserWhereInput>(
      buildSearchCondition(searchTerm.trim(), userSearchableFields)
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

const updateUser = async (id: string, payload: IUpdateUserStatus) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
};

export const AdminService = {
  createCategoryIntoDB,
  getAllUser,
  updateUser,
};
