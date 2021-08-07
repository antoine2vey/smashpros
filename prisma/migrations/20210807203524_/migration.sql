/*
  Warnings:

  - You are about to alter the column `lat` on the `Tournament` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `lng` on the `Tournament` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `prefix` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `lat` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `lng` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `banner` to the `Crew` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Crew` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crew" ADD COLUMN     "banner" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "lat" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "lng" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "prefix",
ALTER COLUMN "lat" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "lng" SET DATA TYPE DOUBLE PRECISION;
