/*
  Warnings:

  - Made the column `adversary_id` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_adversary_id_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "adversary_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_adversary_id_fkey" FOREIGN KEY ("adversary_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
