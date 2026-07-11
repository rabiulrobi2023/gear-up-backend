/*
  Warnings:

  - You are about to alter the column `dailyRate` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "items" ALTER COLUMN "dailyRate" SET DATA TYPE DOUBLE PRECISION;
