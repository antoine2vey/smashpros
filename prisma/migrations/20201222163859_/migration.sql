/*
  Warnings:

  - You are about to alter the column `lat` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `lng` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile_picture" DROP NOT NULL,
ALTER COLUMN "lat" DROP NOT NULL,
ALTER COLUMN "lat" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "lng" DROP NOT NULL,
ALTER COLUMN "lng" SET DATA TYPE DECIMAL(65,30);
