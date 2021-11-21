/*
  Warnings:

  - Added the required column `event_name` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tournament_name_key";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "event_name" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
