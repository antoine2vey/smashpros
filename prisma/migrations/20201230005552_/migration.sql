/*
  Warnings:

  - You are about to drop the `_waiting_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_waiting_members" DROP CONSTRAINT "_waiting_members_A_fkey";

-- DropForeignKey
ALTER TABLE "_waiting_members" DROP CONSTRAINT "_waiting_members_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "crewId" TEXT;

-- DropTable
DROP TABLE "_waiting_members";

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("crewId")REFERENCES "Crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;
