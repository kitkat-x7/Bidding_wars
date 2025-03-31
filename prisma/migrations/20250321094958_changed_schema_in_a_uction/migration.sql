/*
  Warnings:

  - You are about to drop the column `initialbid` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `itemid` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the `Lobby` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LobbyConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lobby_Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LobbyandAuction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[room_id]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[item_id]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `initial_bid` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_id` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Sold', 'Unsold', 'Bidding', 'Onhold');

-- CreateEnum
CREATE TYPE "Room_Status" AS ENUM ('Live', 'Completed', 'Halt', 'Not_Started');

-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_itemid_fkey";

-- DropForeignKey
ALTER TABLE "LobbyConnection" DROP CONSTRAINT "LobbyConnection_lobby_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "LobbyConnection" DROP CONSTRAINT "LobbyConnection_lobby_id_fkey";

-- DropForeignKey
ALTER TABLE "Lobby_Activity" DROP CONSTRAINT "Lobby_Activity_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "Lobby_Activity" DROP CONSTRAINT "Lobby_Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "LobbyandAuction" DROP CONSTRAINT "LobbyandAuction_auction_id_fkey";

-- DropForeignKey
ALTER TABLE "LobbyandAuction" DROP CONSTRAINT "LobbyandAuction_lobby_id_fkey";

-- DropIndex
DROP INDEX "Auction_itemid_key";

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "initialbid",
DROP COLUMN "itemid",
ADD COLUMN     "initial_bid" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "item_id" INTEGER NOT NULL,
ADD COLUMN     "room_id" TEXT NOT NULL,
ADD COLUMN     "room_status" "Room_Status" NOT NULL DEFAULT 'Not_Started',
ALTER COLUMN "final_bid" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Unsold';

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "balance" SET DEFAULT 0;

-- DropTable
DROP TABLE "Lobby";

-- DropTable
DROP TABLE "LobbyConnection";

-- DropTable
DROP TABLE "Lobby_Activity";

-- DropTable
DROP TABLE "LobbyandAuction";

-- DropEnum
DROP TYPE "Lobby_Status";

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "auction_room_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bid" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auction_room_id_key" ON "Auction"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_item_id_key" ON "Auction"("item_id");

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_auction_room_id_fkey" FOREIGN KEY ("auction_room_id") REFERENCES "Auction"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;
