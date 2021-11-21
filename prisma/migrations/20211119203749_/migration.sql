/*
  Warnings:

  - Added the required column `valid` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "valid" BOOLEAN NOT NULL;
