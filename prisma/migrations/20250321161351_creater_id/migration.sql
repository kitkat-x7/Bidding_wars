/*
  Warnings:

  - Added the required column `creater_id` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_user_id_fkey";

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "creater_id" INTEGER NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3),
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_creater_id_fkey" FOREIGN KEY ("creater_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
