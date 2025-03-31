-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Credit', 'Debit');

-- CreateTable
CREATE TABLE "Transaction_History" (
    "id" SERIAL NOT NULL,
    "user_Id" INTEGER NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transaction_History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction_History" ADD CONSTRAINT "Transaction_History_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
