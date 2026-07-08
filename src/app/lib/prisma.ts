import { PrismaPg } from "@prisma/adapter-pg";
import config from "../config";
import { PrismaClient } from "@prisma/client/extension";

const adapter = new PrismaPg(config.DATABASE_URL);
const prisma = new PrismaClient(adapter);
export { prisma };
