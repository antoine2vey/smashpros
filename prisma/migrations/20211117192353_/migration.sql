-- CreateEnum
CREATE TYPE "MatchState" AS ENUM ('HOLD', 'STARTED', 'REFUSED', 'FINISHED');

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "total_matches" INTEGER NOT NULL DEFAULT 1,
    "state" "MatchState" NOT NULL DEFAULT E'HOLD',
    "initiator_id" TEXT NOT NULL,
    "intiator_wins" INTEGER NOT NULL DEFAULT 0,
    "adversary_id" TEXT,
    "adversary_wins" INTEGER NOT NULL DEFAULT 0,
    "is_moneymatch" BOOLEAN NOT NULL DEFAULT false,
    "amount" INTEGER DEFAULT 0,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_adversary_id_fkey" FOREIGN KEY ("adversary_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
