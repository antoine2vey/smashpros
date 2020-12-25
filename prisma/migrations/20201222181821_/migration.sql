/*
  Warnings:

  - You are about to drop the column `tournamentId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tournamentId_fkey";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tournamentId",
ADD COLUMN     "tournament_id" TEXT;

-- AddForeignKey
ALTER TABLE "Tournament" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("tournament_id")REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
