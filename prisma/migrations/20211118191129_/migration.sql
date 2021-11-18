/*
  Warnings:

  - You are about to drop the column `adversary_victory` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `initiator_victory` on the `Battle` table. All the data in the column will be lost.
  - Added the required column `winner_id` to the `Battle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "adversary_victory",
DROP COLUMN "initiator_victory",
ADD COLUMN     "winner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
