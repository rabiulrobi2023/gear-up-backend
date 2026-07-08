-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER', 'PROVIDER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPEND');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "phone" VARCHAR(15),
    "address" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
