/*
  Warnings:

  - A unique constraint covering the columns `[owner_id]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_owner_id_key" ON "Item"("owner_id");
