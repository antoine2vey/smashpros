import logger from '../utils/logger'
import { loadCharacters } from './characters'
import { loadCrews } from './crew'
import { loadRoles } from './roles'
import { loadTournaments } from './tournaments'
import { loadUsers } from './users'

loadUsers().then(() => {
  Promise.all([
    loadRoles(),
    loadCharacters(),
    loadTournaments()
    // loadCrews()
  ])
    .then(() => {
      logger.info("Job's done")
    })
    .catch((error) => {
      logger.info(error)
    })
    .finally(() => {
      process.exit()
    })
})
