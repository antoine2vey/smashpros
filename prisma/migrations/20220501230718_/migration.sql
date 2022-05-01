/*
  Warnings:

  - You are about to drop the column `adversary_character_id` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `adversary_id` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `adversary_id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `adversary_wins` on the `Match` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_adversary_character_id_fkey";

-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_adversary_id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_adversary_id_fkey";

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "adversary_character_id",
DROP COLUMN "adversary_id",
ADD COLUMN     "opponent_character_id" TEXT,
ADD COLUMN     "opponent_id" TEXT;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "adversary_id",
DROP COLUMN "adversary_wins",
ADD COLUMN     "opponent_id" TEXT,
ADD COLUMN     "opponent_wins" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_opponent_id_fkey" FOREIGN KEY ("opponent_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_opponent_id_fkey" FOREIGN KEY ("opponent_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_opponent_character_id_fkey" FOREIGN KEY ("opponent_character_id") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
