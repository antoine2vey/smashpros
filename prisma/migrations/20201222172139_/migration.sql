/*
  Warnings:

  - Added the required column `tournamentId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tournamentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Tournament" (
"id" SERIAL,
    "name" TEXT NOT NULL,
    "lat" DECIMAL(65,30),
    "lng" DECIMAL(65,30),

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("tournamentId")REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
