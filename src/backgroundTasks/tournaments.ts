import { endOfDay, startOfDay } from 'date-fns'
import { prisma } from '../prisma'

function setTournamentsStart() {
  const now = new Date()

  return prisma.tournament.updateMany({
    where: {
      startAt: {
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
      endAt: {
        lte: new Date()
      }
    }
  })
}

export async function run() {
  await cleanOutdatedTournaments()
  await setTournamentsStart()
}