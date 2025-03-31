-- DropForeignKey
ALTER TABLE "LobbyConnection" DROP CONSTRAINT "LobbyConnection_lobby_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "LobbyConnection" DROP CONSTRAINT "LobbyConnection_lobby_id_fkey";

-- DropForeignKey
ALTER TABLE "LobbyandAuction" DROP CONSTRAINT "LobbyandAuction_auction_id_fkey";

-- DropForeignKey
ALTER TABLE "LobbyandAuction" DROP CONSTRAINT "LobbyandAuction_lobby_id_fkey";

-- AddForeignKey
ALTER TABLE "LobbyandAuction" ADD CONSTRAINT "LobbyandAuction_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyandAuction" ADD CONSTRAINT "LobbyandAuction_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "Lobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyConnection" ADD CONSTRAINT "LobbyConnection_lobby_activity_id_fkey" FOREIGN KEY ("lobby_activity_id") REFERENCES "Lobby_Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyConnection" ADD CONSTRAINT "LobbyConnection_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "Lobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;
