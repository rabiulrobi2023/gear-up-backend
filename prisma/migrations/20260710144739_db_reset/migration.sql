/*
  Warnings:

  - You are about to drop the column `unitdailyRate` on the `orders` table. All the data in the column will be lost.
  - Added the required column `dailyRate` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "unitdailyRate",
ADD COLUMN     "dailyRate" DECIMAL(10,2) NOT NULL;
