/*
  Warnings:

  - The `smashgg_player_id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `smashgg_user_id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[smashgg_player_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[smashgg_user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "smashgg_player_id",
ADD COLUMN     "smashgg_player_id" INTEGER,
DROP COLUMN "smashgg_user_id",
ADD COLUMN     "smashgg_user_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_smashgg_player_id_key" ON "User"("smashgg_player_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_smashgg_user_id_key" ON "User"("smashgg_user_id");
