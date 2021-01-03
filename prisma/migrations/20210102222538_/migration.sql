/*
  Warnings:

  - You are about to drop the column `tournament_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tournament_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tournament_id",
ADD COLUMN     "tournaments_id" TEXT;

-- CreateTable
CREATE TABLE "_TournamentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TournamentToUser_AB_unique" ON "_TournamentToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TournamentToUser_B_index" ON "_TournamentToUser"("B");

-- AddForeignKey
ALTER TABLE "_TournamentToUser" ADD FOREIGN KEY("A")REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentToUser" ADD FOREIGN KEY("B")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("tournaments_id")REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
