/*
  Warnings:

  - You are about to drop the column `crewId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_crewId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "crewId",
ADD COLUMN     "crew_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("crew_id")REFERENCES "Crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;
