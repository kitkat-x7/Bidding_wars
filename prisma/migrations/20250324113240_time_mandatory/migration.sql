/*
  Warnings:

  - Made the column `end_time` on table `Auction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_time` on table `Auction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `findal_bidder_id` on table `Auction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auction" ALTER COLUMN "end_time" SET NOT NULL,
ALTER COLUMN "start_time" SET NOT NULL,
ALTER COLUMN "findal_bidder_id" SET NOT NULL;
