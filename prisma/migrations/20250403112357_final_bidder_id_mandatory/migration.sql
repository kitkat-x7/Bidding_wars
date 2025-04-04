/*
  Warnings:

  - Made the column `findal_bidder_id` on table `Auction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auction" ALTER COLUMN "findal_bidder_id" SET NOT NULL;
