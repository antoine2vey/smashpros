-- RenameIndex
ALTER INDEX "Character.name_unique" RENAME TO "Character_name_key";

-- RenameIndex
ALTER INDEX "Crew.name_unique" RENAME TO "Crew_name_key";

-- RenameIndex
ALTER INDEX "Role.name_unique" RENAME TO "Role_name_key";

-- RenameIndex
ALTER INDEX "Tournament.name_unique" RENAME TO "Tournament_name_key";

-- RenameIndex
ALTER INDEX "Tournament.tournament_id_unique" RENAME TO "Tournament_tournament_id_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
