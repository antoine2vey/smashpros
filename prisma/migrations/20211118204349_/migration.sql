/*
  Warnings:

  - You are about to drop the column `authorized_notifications` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "authorized_notifications",
ADD COLUMN     "allow_notifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allow_searchability" BOOLEAN NOT NULL DEFAULT true;
