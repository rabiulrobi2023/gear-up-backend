import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

const config = {
  PORT: Number(process.env.PORT || 5000),
  DATABASE_URL: process.env.DATABASE_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRE_IN: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRE_IN: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PAYMENT_SUCCESS_URL: process.env.STRIPE_PAYMENT_SUCCESS_URL,
  STRIPE_PAYMENT_CANCEL_URL: process.env.STRIPE_PAYMENT_CANCEL_URL,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};

export default config;
