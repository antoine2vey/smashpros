-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_match_id_fkey";

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
