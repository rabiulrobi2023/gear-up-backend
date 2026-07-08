import { Response } from "express";
import ms, { StringValue } from "ms";
import config from "../config";
import { NodeEnv } from "../../../generated/prisma/enums";

const setTokenIntoCookie = (
  res: Response,
  tokenName: string,
  token: string,
  maxAge: number,
) => {
  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: config.NODE_ENV === NodeEnv.PRODUCTION,
    sameSite: "lax",
    maxAge,
  });
};

export const setAccessTokenIntoCookie = (res: Response, token: string) => {
  const maxAge = ms(config.JWT_ACCESS_TOKEN_EXPIRE_IN as StringValue);
  setTokenIntoCookie(res, "accessToken", token, maxAge);
};

export const setRefreshTokenIntoCookie = (res: Response, token: string) => {
  const maxAge = ms(config.JWT_REFRESH_TOKEN_EXPIRE_IN as StringValue);
  setTokenIntoCookie(res, "refreshToken", token, maxAge);
};
