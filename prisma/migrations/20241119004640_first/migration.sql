-- CreateEnum
CREATE TYPE "Utility" AS ENUM ('on', 'off');

-- CreateEnum
CREATE TYPE "GroupState" AS ENUM ('win', 'lose', 'equal', 'recognizement');

-- CreateTable
CREATE TABLE "Bids" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "author" TEXT NOT NULL,

    CONSTRAINT "Bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "groupState" "GroupState" NOT NULL,
    "utility" "Utility" DEFAULT 'on',

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
