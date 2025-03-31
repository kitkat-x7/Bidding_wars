/*
  Warnings:

  - You are about to drop the column `end_time` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `final_bid` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `initial_bid` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `Business_History` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Business_History" DROP CONSTRAINT "Business_History_itemid_fkey";

-- DropForeignKey
ALTER TABLE "Business_History" DROP CONSTRAINT "Business_History_room_Id_fkey";

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "end_time";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "final_bid",
DROP COLUMN "initial_bid";

-- DropTable
DROP TABLE "Business_History";

-- CreateTable
CREATE TABLE "Order_History" (
    "id" SERIAL NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,
    "buyer_Id" INTEGER NOT NULL,
    "seller_Id" INTEGER NOT NULL,
    "itemid" INTEGER NOT NULL,
    "room_Id" INTEGER NOT NULL,

    CONSTRAINT "Order_History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_History_room_Id_key" ON "Order_History"("room_Id");

-- AddForeignKey
ALTER TABLE "Order_History" ADD CONSTRAINT "Order_History_itemid_fkey" FOREIGN KEY ("itemid") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_History" ADD CONSTRAINT "Order_History_room_Id_fkey" FOREIGN KEY ("room_Id") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
