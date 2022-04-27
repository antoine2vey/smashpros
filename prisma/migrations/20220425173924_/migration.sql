/*
  Warnings:

  - A unique constraint covering the columns `[admin_id]` on the table `Crew` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admin_id` to the `Crew` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crew" ADD COLUMN     "admin_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Crew_admin_id_key" ON "Crew"("admin_id");

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
