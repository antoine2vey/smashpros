/*
  Warnings:

  - A unique constraint covering the columns `[initiator_id]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adversary_id]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `initiator_id` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchState" AS ENUM ('HOLD', 'STARTED', 'REFUSED', 'FINISHED');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "adversary_id" TEXT,
ADD COLUMN     "adversary_wins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "amount" INTEGER DEFAULT 0,
ADD COLUMN     "initiator_id" TEXT NOT NULL,
ADD COLUMN     "intiator_wins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_moneymatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" "MatchState" NOT NULL DEFAULT E'HOLD';

-- CreateIndex
CREATE UNIQUE INDEX "Match_initiator_id_key" ON "Match"("initiator_id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_adversary_id_key" ON "Match"("adversary_id");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_adversary_id_fkey" FOREIGN KEY ("adversary_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
