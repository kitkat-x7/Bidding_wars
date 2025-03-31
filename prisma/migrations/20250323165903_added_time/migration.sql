/*
  Warnings:

  - Added the required column `Time` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auction" ALTER COLUMN "end_time" SET DATA TYPE TEXT,
ALTER COLUMN "start_time" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "Time" TEXT NOT NULL;
