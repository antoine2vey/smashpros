/*
  Warnings:

  - You are about to drop the column `current_tournament_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_current_tournament_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "current_tournament_id";
