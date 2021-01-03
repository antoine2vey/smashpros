/*
  Warnings:

  - You are about to drop the column `tournaments_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_TournamentToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TournamentToUser" DROP CONSTRAINT "_TournamentToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TournamentToUser" DROP CONSTRAINT "_TournamentToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tournaments_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tournaments_id",
ADD COLUMN     "current_tournament_id" TEXT;

-- CreateTable
CREATE TABLE "_user_tournaments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- DropTable
DROP TABLE "_TournamentToUser";

-- CreateIndex
CREATE UNIQUE INDEX "_user_tournaments_AB_unique" ON "_user_tournaments"("A", "B");

-- CreateIndex
CREATE INDEX "_user_tournaments_B_index" ON "_user_tournaments"("B");

-- AddForeignKey
ALTER TABLE "_user_tournaments" ADD FOREIGN KEY("A")REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_tournaments" ADD FOREIGN KEY("B")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("current_tournament_id")REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
