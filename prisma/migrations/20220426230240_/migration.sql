-- DropForeignKey
ALTER TABLE "Crew" DROP CONSTRAINT "Crew_admin_id_fkey";

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
