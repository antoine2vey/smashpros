import { connectMongo } from '../mongo'
import logger from '../utils/logger'
import { loadCharacters } from './characters'
import { loadCrews } from './crew'
import { loadRoles } from './roles'
import { loadTournaments } from './tournaments'
import { loadUsers } from './users'
import { loadZones } from './zones'

connectMongo().then(() => {
  loadUsers().then(() => {
    Promise.all([
      loadRoles(),
      loadCharacters(),
      loadTournaments(),
      loadZones()
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
})
