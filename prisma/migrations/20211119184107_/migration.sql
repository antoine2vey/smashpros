/*
  Warnings:

  - You are about to drop the column `countryCode` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `endAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `eventRegistrationClosesAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `hasOfflineEvents` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `isRegistrationOpen` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `numAttendees` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `venueAddress` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `venueName` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `country_code` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "countryCode",
DROP COLUMN "createdAt",
DROP COLUMN "endAt",
DROP COLUMN "eventRegistrationClosesAt",
DROP COLUMN "hasOfflineEvents",
DROP COLUMN "isRegistrationOpen",
DROP COLUMN "numAttendees",
DROP COLUMN "startAt",
DROP COLUMN "venueAddress",
DROP COLUMN "venueName",
ADD COLUMN     "country_code" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3),
ADD COLUMN     "end_at" TIMESTAMP(3),
ADD COLUMN     "event_registration_closes_at" TIMESTAMP(3),
ADD COLUMN     "has_offline_events" BOOLEAN,
ADD COLUMN     "is_registration_open" BOOLEAN,
ADD COLUMN     "num_attendees" INTEGER,
ADD COLUMN     "start_at" TIMESTAMP(3),
ADD COLUMN     "venue_address" TEXT,
ADD COLUMN     "venue_name" TEXT;
