/*
  Warnings:

  - A unique constraint covering the columns `[smashgg_slug]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notification_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_smashgg_slug_key" ON "User"("smashgg_slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_notification_token_key" ON "User"("notification_token");
