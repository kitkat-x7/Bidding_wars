/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `Transaction_History` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction_History" DROP COLUMN "transaction_id";
