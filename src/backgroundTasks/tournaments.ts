import { endOfDay, fromUnixTime, isBefore, startOfDay } from 'date-fns'
import { prisma } from '../prisma'
import logger from '../utils/logger'
import { loadTournaments } from '../utils/tournament'

function setTournamentsStart() {
  const now = new Date()

  return prisma.tournament.updateMany({
    where: {
      start_at: {
        gte: startOfDay(now),
        lte: endOfDay(now)
      }
    },
    data: {
      is_started: true
    }
  })
}

function cleanOutdatedTournaments() {
  return prisma.tournament.deleteMany({
    where: {
      end_at: {
        lte: new Date()
      }
    }
  })
}

export async function executeTournamentsQueries() {
  try {
    logger.info('Loading tournaments...')
    await loadTournaments()
    logger.info('Loaded tournaments')

    logger.info('Cleaning up tournaments')
    await cleanOutdatedTournaments()
    logger.info('Cleaned tournaments up')

    logger.info('Set tournements is_started to true for todays date')
    await setTournamentsStart()
    logger.info('Done setting tournaments')
  } catch (error) {
    logger.error('Error at executing tournament queries', error)
  }
}
