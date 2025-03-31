/*
  Warnings:

  - You are about to drop the column `initialbid` on the `Item` table. All the data in the column will be lost.
  - Added the required column `final_bid` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initial_bid` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "initialbid",
ADD COLUMN     "final_bid" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "initial_bid" DOUBLE PRECISION NOT NULL;
