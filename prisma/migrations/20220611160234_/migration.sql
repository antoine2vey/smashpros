/*
  Warnings:

  - The values [CHARACTER_CHOICE,PLAYING] on the enum `MatchState` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "BattleState" AS ENUM ('CHARACTER_CHOICE', 'VOTING', 'FINISHED');

-- AlterEnum
BEGIN;
CREATE TYPE "MatchState_new" AS ENUM ('HOLD', 'REFUSED', 'STARTED', 'FINISHED');
ALTER TABLE "Match" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Match" ALTER COLUMN "state" TYPE "MatchState_new" USING ("state"::text::"MatchState_new");
ALTER TYPE "MatchState" RENAME TO "MatchState_old";
ALTER TYPE "MatchState_new" RENAME TO "MatchState";
DROP TYPE "MatchState_old";
ALTER TABLE "Match" ALTER COLUMN "state" SET DEFAULT 'HOLD';
COMMIT;

-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "state" "BattleState" NOT NULL DEFAULT E'CHARACTER_CHOICE';
