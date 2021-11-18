-- DropIndex
DROP INDEX "Match_adversary_id_key";

-- DropIndex
DROP INDEX "Match_initiator_id_key";

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "adversary_id" TEXT NOT NULL,
    "adversary_character_id" TEXT NOT NULL,
    "adversary_victory" BOOLEAN NOT NULL,
    "initiator_id" TEXT NOT NULL,
    "initiator_character_id" TEXT NOT NULL,
    "initiator_victory" BOOLEAN NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_adversary_id_fkey" FOREIGN KEY ("adversary_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_adversary_character_id_fkey" FOREIGN KEY ("adversary_character_id") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_initiator_character_id_fkey" FOREIGN KEY ("initiator_character_id") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
