-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_winner_id_fkey";

-- AlterTable
ALTER TABLE "Battle" ALTER COLUMN "winner_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
