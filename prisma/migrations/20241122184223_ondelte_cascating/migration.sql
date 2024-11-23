-- DropForeignKey
ALTER TABLE "Bids" DROP CONSTRAINT "Bids_groupId_fkey";

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
