/*
  Warnings:

  - You are about to drop the column `smashgg_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[smashgg_player_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[smashgg_user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_smashgg_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "smashgg_id",
ADD COLUMN     "smashgg_player_id" TEXT,
ADD COLUMN     "smashgg_user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_smashgg_player_id_key" ON "User"("smashgg_player_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_smashgg_user_id_key" ON "User"("smashgg_user_id");
