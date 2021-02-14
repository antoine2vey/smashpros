-- CreateTable
CREATE TABLE "_user_tournaments_organizer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_user_tournaments_organizer_AB_unique" ON "_user_tournaments_organizer"("A", "B");

-- CreateIndex
CREATE INDEX "_user_tournaments_organizer_B_index" ON "_user_tournaments_organizer"("B");

-- AddForeignKey
ALTER TABLE "_user_tournaments_organizer" ADD FOREIGN KEY("A")REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_tournaments_organizer" ADD FOREIGN KEY("B")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
