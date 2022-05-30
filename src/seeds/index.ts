import { connectMongo } from '../mongo'
import logger from '../utils/logger'
import { loadTournaments } from '../utils/tournament'
import { loadCharacters } from './characters'
import { loadCrews } from './crew'
import { loadRoles } from './roles'
import { loadUsers } from './users'
import { loadZones } from './zones'

async function seed() {
  try {
    await connectMongo()
    await loadUsers()

    await Promise.all([
      loadRoles(),
      loadCharacters(),
      loadTournaments(),
      loadZones()
      // loadCrews()
    ])

    logger.info("Job's done")
    process.exit(0)
  } catch (error) {
    logger.info(error)
    process.exit(1)
  }
}

seed()
