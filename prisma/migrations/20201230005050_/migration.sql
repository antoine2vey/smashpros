/*
  Warnings:

  - You are about to drop the column `crewId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_crewId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "crewId";

-- CreateTable
CREATE TABLE "_waiting_members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_waiting_members_AB_unique" ON "_waiting_members"("A", "B");

-- CreateIndex
CREATE INDEX "_waiting_members_B_index" ON "_waiting_members"("B");

-- AddForeignKey
ALTER TABLE "_waiting_members" ADD FOREIGN KEY("A")REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_waiting_members" ADD FOREIGN KEY("B")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
