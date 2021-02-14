/*
  Warnings:

  - You are about to drop the column `is_playing` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_playing",
ADD COLUMN     "is_checked_in" BOOLEAN NOT NULL DEFAULT false;
