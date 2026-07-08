import config from "../config";
import { IJwtPayload } from "../interface/interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateAccessToken = (payload: IJwtPayload) => {
  const token = jwt.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: config.JWT_ACCESS_TOKEN_EXPIRE_IN,
  } as SignOptions);

  return token;
};
export const generateRefreshToken = (payload: IJwtPayload) => {
  const token = jwt.sign(payload, config.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: config.JWT_REFRESH_TOKEN_EXPIRE_IN,
  } as SignOptions);

  return token;
};

export const verifyJwtToken = (token: string, secret: string):JwtPayload=>
  jwt.verify(token, secret) as JwtPayload
