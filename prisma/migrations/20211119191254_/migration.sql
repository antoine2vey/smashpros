/*
  Warnings:

  - A unique constraint covering the columns `[event_id]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "event_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_event_id_key" ON "Tournament"("event_id");
