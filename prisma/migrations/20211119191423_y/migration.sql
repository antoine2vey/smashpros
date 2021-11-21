/*
  Warnings:

  - A unique constraint covering the columns `[event_id]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `event_id` on the `Tournament` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "event_id",
ADD COLUMN     "event_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_event_id_key" ON "Tournament"("event_id");
