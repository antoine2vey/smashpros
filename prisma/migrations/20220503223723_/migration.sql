/*
  Warnings:

  - You are about to drop the column `intiator_wins` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "intiator_wins",
ADD COLUMN     "initiator_wins" INTEGER NOT NULL DEFAULT 0;
