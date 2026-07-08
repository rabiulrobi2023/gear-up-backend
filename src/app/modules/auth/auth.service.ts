import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";
import config from "../../config";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (isUserExists) {
    throw new AppError(StatusCodes.CONFLICT, "Email already exists");
  }
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND),
  );

  const result = await prisma.user.create({
    data: { ...payload, password: hashPassword },
    omit: {
      password: true,
    },
  });
  return result;
};
export const AuthService = {
  registerUserIntoDB,
};
