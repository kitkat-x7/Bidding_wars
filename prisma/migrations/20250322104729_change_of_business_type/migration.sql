/*
  Warnings:

  - You are about to drop the column `type` on the `Business_History` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Business_History` table. All the data in the column will be lost.
  - You are about to drop the `Bid_History` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[room_Id]` on the table `Business_History` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyer_Id` to the `Business_History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_Id` to the `Business_History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_Id` to the `Business_History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bid_History" DROP CONSTRAINT "Bid_History_auction_id_fkey";

-- DropForeignKey
ALTER TABLE "Bid_History" DROP CONSTRAINT "Bid_History_userId_fkey";

-- DropForeignKey
ALTER TABLE "Business_History" DROP CONSTRAINT "Business_History_userId_fkey";

-- AlterTable
ALTER TABLE "Business_History" DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "buyer_Id" INTEGER NOT NULL,
ADD COLUMN     "room_Id" INTEGER NOT NULL,
ADD COLUMN     "seller_Id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Bid_History";

-- DropEnum
DROP TYPE "Bid_Status";

-- DropEnum
DROP TYPE "Business_Type";

-- CreateIndex
CREATE UNIQUE INDEX "Business_History_room_Id_key" ON "Business_History"("room_Id");

-- AddForeignKey
ALTER TABLE "Business_History" ADD CONSTRAINT "Business_History_room_Id_fkey" FOREIGN KEY ("room_Id") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
