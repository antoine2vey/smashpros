/*
  Warnings:

  - You are about to drop the column `event_id` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `event_name` on the `Tournament` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tournament_id]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tournament_event_id_key";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "event_id",
DROP COLUMN "event_name";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_tournament_id_key" ON "Tournament"("tournament_id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
