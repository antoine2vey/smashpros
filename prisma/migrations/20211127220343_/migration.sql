-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "tournament_id" TEXT;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
