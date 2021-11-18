/*
  Warnings:

  - A unique constraint covering the columns `[initiator_id]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adversary_id]` on the table `Match` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Match_initiator_id_key" ON "Match"("initiator_id");

-- CreateIndex
CREATE UNIQUE INDEX "Match_adversary_id_key" ON "Match"("adversary_id");
