-- AlterEnum
ALTER TYPE "MatchState" ADD VALUE 'VOTING';

-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_at" TIMESTAMP(3),
ADD COLUMN     "initiator_vote_id" TEXT,
ADD COLUMN     "opponent_vote_id" TEXT,
ADD COLUMN     "start_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_opponent_vote_id_fkey" FOREIGN KEY ("opponent_vote_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_initiator_vote_id_fkey" FOREIGN KEY ("initiator_vote_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
