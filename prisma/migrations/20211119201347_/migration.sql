/*
  Warnings:

  - You are about to drop the column `tier` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `num_attendees` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tier` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "num_attendees" INTEGER NOT NULL,
ADD COLUMN     "tier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "tier";
