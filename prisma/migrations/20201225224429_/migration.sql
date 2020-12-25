/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[reset_token]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User.reset_token_unique" ON "User"("reset_token");
