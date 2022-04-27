-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_adversary_character_id_fkey";

-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_adversary_id_fkey";

-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_initiator_character_id_fkey";

-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_initiator_id_fkey";

-- DropForeignKey
ALTER TABLE "Crew" DROP CONSTRAINT "Crew_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_adversary_id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_initiator_id_fkey";

-- AlterTable
ALTER TABLE "Battle" ALTER COLUMN "adversary_id" DROP NOT NULL,
ALTER COLUMN "adversary_character_id" DROP NOT NULL,
ALTER COLUMN "initiator_id" DROP NOT NULL,
ALTER COLUMN "initiator_character_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "adversary_id" DROP NOT NULL,
ALTER COLUMN "initiator_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_adversary_id_fkey" FOREIGN KEY ("adversary_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_adversary_id_fkey" FOREIGN KEY ("adversary_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_adversary_character_id_fkey" FOREIGN KEY ("adversary_character_id") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_initiator_character_id_fkey" FOREIGN KEY ("initiator_character_id") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
