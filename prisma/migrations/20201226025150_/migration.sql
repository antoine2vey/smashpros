/*
  Warnings:

  - Changed the type of `tournament_id` on the `Tournament` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "tournament_id",
ADD COLUMN     "tournament_id" INTEGER NOT NULL;
