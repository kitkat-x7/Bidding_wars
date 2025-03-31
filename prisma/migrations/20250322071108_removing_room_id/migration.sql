/*
  Warnings:

  - You are about to drop the column `room_id` on the `Auction` table. All the data in the column will be lost.
  - Changed the type of `auction_room_id` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_auction_room_id_fkey";

-- DropIndex
DROP INDEX "Auction_room_id_key";

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "room_id";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "auction_room_id",
ADD COLUMN     "auction_room_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_auction_room_id_fkey" FOREIGN KEY ("auction_room_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
