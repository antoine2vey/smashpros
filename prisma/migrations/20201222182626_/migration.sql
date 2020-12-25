/*
  Warnings:

  - You are about to drop the column `userId` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_userId_fkey";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_favorites_tournaments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_favorites_tournaments_AB_unique" ON "_favorites_tournaments"("A", "B");

-- CreateIndex
CREATE INDEX "_favorites_tournaments_B_index" ON "_favorites_tournaments"("B");

-- AddForeignKey
ALTER TABLE "_favorites_tournaments" ADD FOREIGN KEY("A")REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorites_tournaments" ADD FOREIGN KEY("B")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
