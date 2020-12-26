/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[tournament_id]` on the table `Tournament`. If there are existing duplicate values, the migration will fail.
  - Added the required column `tournament_id` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryCode` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numAttendees` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "tournament_id" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3),
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "numAttendees" INTEGER NOT NULL,
ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "eventRegistrationClosesAt" TIMESTAMP(3),
ADD COLUMN     "hasOfflineEvents" BOOLEAN,
ADD COLUMN     "images" JSONB[],
ADD COLUMN     "isRegistrationOpen" BOOLEAN,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "state" INTEGER NOT NULL,
ADD COLUMN     "venueName" TEXT,
ADD COLUMN     "venueAddress" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament.tournament_id_unique" ON "Tournament"("tournament_id");
