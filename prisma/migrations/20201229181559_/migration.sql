/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[name]` on the table `Crew`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[tournament_id]` on the table `Tournament`. If there are existing duplicate values, the migration will fail.
  - Made the column `prefix` on table `Crew` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CREW_ADMIN';

-- AlterTable
ALTER TABLE "Crew" ALTER COLUMN "prefix" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "roles" "Role"[];

-- CreateIndex
CREATE UNIQUE INDEX "Crew.name_unique" ON "Crew"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament.tournament_id_unique" ON "Tournament"("tournament_id");
