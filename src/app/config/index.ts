import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

const requiredEnvVariables = [
  "PORT",
  "DATABASE_URL",
  "FRONTEND_URL",
  "NODE_ENV",
  "BCRYPT_SALT_ROUND",
] as const;

const loadEnvConfig = () => {
  for (const envVar of requiredEnvVariables) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }

  return Object.fromEntries(
    requiredEnvVariables.map((envVar) => [envVar, process.env[envVar]]),
  ) as Record<(typeof requiredEnvVariables)[number], string>;
};

const config = loadEnvConfig();
export default config;
