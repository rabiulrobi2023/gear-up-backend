import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

import config from "../config";
import { prisma } from "../lib/prisma";
import { verifyJwtToken } from "../utils/jwt";
import { IJwtPayload } from "../interface/interface";
import { Role } from "../../../generated/prisma/enums";

const auth = (...roles: Role[]) => {
  return catchAsync(async (req, res, next) => {
    const accessToken =
      req.cookies.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization);

    if (!accessToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const decoded = verifyJwtToken(accessToken, config.JWT_ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, status: true },
    });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!roles.includes(decoded.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to perform this action.",
      );
    }

    if (user.status === "SUSPEND") {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Your account has been suspended",
      );
    }

    req.user = decoded as IJwtPayload;

    next();
  });
};

export default auth;
