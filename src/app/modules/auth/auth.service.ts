import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";
import config from "../../config";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { IJwtPayload } from "../../interface/interface";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  if (payload.role === "ADMIN") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You can not create an admin account",
    );
  }
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

const loginUserIntoDB = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.status === "SUSPEND") {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Your account has been suspended",
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }
  const jwtTokenPayload: IJwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(jwtTokenPayload);
  const refreshToken = generateRefreshToken(jwtTokenPayload);
  return {
    accessToken,
    refreshToken,
  };
};

const getMeFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
  });
  return result;
};

export const AuthService = {
  registerUserIntoDB,
  loginUserIntoDB,
  getMeFromDB,
};
