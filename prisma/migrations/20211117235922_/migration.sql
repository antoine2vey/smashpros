/*
  Warnings:

  - You are about to drop the column `adversary_id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `adversary_wins` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `initiator_id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `intiator_wins` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `is_moneymatch` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Match` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_adversary_id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_initiator_id_fkey";

-- DropIndex
DROP INDEX "Match_adversary_id_key";

-- DropIndex
DROP INDEX "Match_initiator_id_key";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "adversary_id",
DROP COLUMN "adversary_wins",
DROP COLUMN "amount",
DROP COLUMN "initiator_id",
DROP COLUMN "intiator_wins",
DROP COLUMN "is_moneymatch",
DROP COLUMN "state";
