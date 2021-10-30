import logger from "../utils/logger";
import { loadCharacters } from "./characters";
import { loadRoles } from "./roles";
import { loadTournaments } from "./tournaments";
import { loadUsers } from "./users";

Promise.all([
  loadRoles(),
  loadCharacters(),
  loadTournaments(),
  loadUsers()
])
  .then(() => {
    logger.info('Job\'s done')
  })
  .catch((error) => {
    logger.info(error)
  })
  .finally(() => {
    process.exit()
  })