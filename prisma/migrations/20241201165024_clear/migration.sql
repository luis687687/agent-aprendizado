/*
  Warnings:

  - You are about to drop the `Bids` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bids" DROP CONSTRAINT "Bids_groupId_fkey";

-- DropTable
DROP TABLE "Bids";

-- DropTable
DROP TABLE "Group";

-- DropEnum
DROP TYPE "GroupState";

-- DropEnum
DROP TYPE "Utility";
