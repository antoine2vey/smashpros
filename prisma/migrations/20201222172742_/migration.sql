/*
  Warnings:

  - The migration will change the primary key for the `Character` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Tournament` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `User` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will add a unique constraint covering the columns `[name]` on the table `Tournament`. If there are existing duplicate values, the migration will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterToUser" DROP CONSTRAINT "_CharacterToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterToUser" DROP CONSTRAINT "_CharacterToUser_B_fkey";

-- AlterTable
ALTER TABLE "Character" DROP CONSTRAINT "Character_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Character_id_seq";

-- AlterTable
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Tournament_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tournamentId" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "_CharacterToUser" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament.name_unique" ON "Tournament"("name");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY("tournamentId")REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToUser" ADD FOREIGN KEY("A")REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToUser" ADD FOREIGN KEY("B")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
