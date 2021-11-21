-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_tournament_id_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
