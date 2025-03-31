/*
  Warnings:

  - You are about to drop the column `user_id` on the `Auction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "user_id",
ADD COLUMN     "findal_bidder_id" INTEGER;
