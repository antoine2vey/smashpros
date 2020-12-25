/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Character`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[name]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "prefix" TEXT,
ADD COLUMN     "crewId" TEXT;

-- CreateTable
CREATE TABLE "Crew" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character.name_unique" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User.name_unique" ON "User"("name");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("crewId")REFERENCES "Crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;
