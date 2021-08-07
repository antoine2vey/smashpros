/*
  Warnings:

  - Added the required column `icon` to the `Crew` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banner` to the `Crew` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crew" ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "banner" TEXT NOT NULL;
