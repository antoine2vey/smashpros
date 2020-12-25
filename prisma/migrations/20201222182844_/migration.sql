/*
  Warnings:

  - You are about to drop the `_favorites_tournaments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_favorites_tournaments" DROP CONSTRAINT "_favorites_tournaments_A_fkey";

-- DropForeignKey
ALTER TABLE "_favorites_tournaments" DROP CONSTRAINT "_favorites_tournaments_B_fkey";

-- CreateTable
CREATE TABLE "_favorited_tournaments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- DropTable
DROP TABLE "_favorites_tournaments";

-- CreateIndex
CREATE UNIQUE INDEX "_favorited_tournaments_AB_unique" ON "_favorited_tournaments"("A", "B");

-- CreateIndex
CREATE INDEX "_favorited_tournaments_B_index" ON "_favorited_tournaments"("B");

-- AddForeignKey
ALTER TABLE "_favorited_tournaments" ADD FOREIGN KEY("A")REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorited_tournaments" ADD FOREIGN KEY("B")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
