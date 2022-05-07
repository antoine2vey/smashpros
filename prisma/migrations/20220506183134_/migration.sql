-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "winner_id" TEXT;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
