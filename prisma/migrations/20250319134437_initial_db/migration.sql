-- CreateEnum
CREATE TYPE "Bid_Status" AS ENUM ('Purchased', 'Not_Purchased', 'On_Going');

-- CreateEnum
CREATE TYPE "Business_Type" AS ENUM ('Buying', 'Selling');

-- CreateEnum
CREATE TYPE "Lobby_Status" AS ENUM ('Live', 'Completed', 'Halt', 'Not_Started');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid_History" (
    "id" SERIAL NOT NULL,
    "status" "Bid_Status" NOT NULL DEFAULT 'Not_Purchased',
    "userId" INTEGER NOT NULL,
    "auction_id" INTEGER NOT NULL,

    CONSTRAINT "Bid_History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business_History" (
    "id" SERIAL NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,
    "type" "Business_Type" NOT NULL DEFAULT 'Buying',
    "userId" INTEGER NOT NULL,
    "itemid" INTEGER NOT NULL,

    CONSTRAINT "Business_History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "initialbid" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" SERIAL NOT NULL,
    "itemid" INTEGER NOT NULL,
    "initialbid" DOUBLE PRECISION NOT NULL,
    "final_bid" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lobby" (
    "id" SERIAL NOT NULL,
    "status" "Lobby_Status" NOT NULL DEFAULT 'Not_Started',

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lobby_Activity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "bid" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lobby_Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LobbyandAuction" (
    "id" SERIAL NOT NULL,
    "lobby_id" INTEGER NOT NULL,
    "auction_id" INTEGER NOT NULL,

    CONSTRAINT "LobbyandAuction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LobbyConnection" (
    "id" SERIAL NOT NULL,
    "lobby_id" INTEGER NOT NULL,
    "lobby_activity_id" INTEGER NOT NULL,

    CONSTRAINT "LobbyConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_History_itemid_key" ON "Business_History"("itemid");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_itemid_key" ON "Auction"("itemid");

-- CreateIndex
CREATE UNIQUE INDEX "LobbyandAuction_lobby_id_key" ON "LobbyandAuction"("lobby_id");

-- CreateIndex
CREATE UNIQUE INDEX "LobbyandAuction_auction_id_key" ON "LobbyandAuction"("auction_id");

-- CreateIndex
CREATE UNIQUE INDEX "LobbyandAuction_lobby_id_auction_id_key" ON "LobbyandAuction"("lobby_id", "auction_id");

-- CreateIndex
CREATE UNIQUE INDEX "LobbyConnection_lobby_id_lobby_activity_id_key" ON "LobbyConnection"("lobby_id", "lobby_activity_id");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid_History" ADD CONSTRAINT "Bid_History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid_History" ADD CONSTRAINT "Bid_History_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business_History" ADD CONSTRAINT "Business_History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business_History" ADD CONSTRAINT "Business_History_itemid_fkey" FOREIGN KEY ("itemid") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_itemid_fkey" FOREIGN KEY ("itemid") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lobby_Activity" ADD CONSTRAINT "Lobby_Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lobby_Activity" ADD CONSTRAINT "Lobby_Activity_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyandAuction" ADD CONSTRAINT "LobbyandAuction_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyandAuction" ADD CONSTRAINT "LobbyandAuction_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyConnection" ADD CONSTRAINT "LobbyConnection_lobby_activity_id_fkey" FOREIGN KEY ("lobby_activity_id") REFERENCES "Lobby_Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyConnection" ADD CONSTRAINT "LobbyConnection_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
