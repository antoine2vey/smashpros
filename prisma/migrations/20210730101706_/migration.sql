/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Role`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role.name_unique" ON "Role"("name");
