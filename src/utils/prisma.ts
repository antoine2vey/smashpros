import { Battle, Prisma } from '@prisma/client'
import { addDays, isBefore, nextDay } from 'date-fns'
import { connectionPlugin } from 'nexus'
import { cache, cacheKeys } from '../redis'

export function getCharacterQuery(characters: string[] | undefined) {
  if (!characters || characters.length === 0) {
    return undefined
  }

  return {
    some: {
      OR: characters.map((id) => ({ id }))
    }
  }
}

export function getTournamentQuery(tournament: string | undefined) {
  if (!tournament) {
    return undefined
  }

  return {
    some: {
      id: tournament
    }
  }
}

export function getTagQuery(tag: string | undefined): Prisma.StringFilter {
  if (!tag) {
    return undefined
  }

  return {
    contains: tag,
    mode: 'insensitive'
  }
}

export function getBattleCharacterQuery(
  character: string | undefined,
  isInitiator: boolean
) {
  if (!character) {
    return undefined
  }

  return {
    initiator_character: isInitiator
      ? { connect: { id: character } }
      : undefined,
    opponent_character: !isInitiator
      ? { connect: { id: character } }
      : undefined
  }
}

export function getVoteQuery(vote: string | undefined, isInitiator: boolean) {
  if (!vote) {
    return undefined
  }

  return {
    opponent_vote: !isInitiator
      ? {
          connect: {
            id: vote
          }
        }
      : undefined,
    initiator_vote: isInitiator
      ? {
          connect: {
            id: vote
          }
        }
      : undefined
  }
}

export function getBattleWinner(
  battle: Battle,
  vote: string | undefined,
  isInitiator: boolean
) {
  if (!vote) {
    return undefined
  }

  /**
   * If initiator:
   *  - Check that vote is the same as opponent
   * If opponent:
   *  - Check that vote is the same as initiator
   */
  if (
    vote === (isInitiator ? battle.opponent_vote_id : battle.initiator_vote_id)
  ) {
    return vote
  }

  // Users didn't came to an agreement, don't update winner yet
  return undefined
}

export async function getSpatialTournaments(
  lat: number | null,
  lng: number | null,
  radius: number | null
) {
  let nearbyTournaments: number[] = undefined

  if (lat && lng) {
    // Get all tournaments that are close to given lng/lat
    const results = await cache.geosearch(
      cacheKeys.tournaments,
      'FROMLONLAT',
      lng,
      lat,
      'BYRADIUS',
      radius || 50,
      'km'
    )
    // Process cache key (tournament_id)
    nearbyTournaments = results.map((result) => +result.split('-')[1])
  }

  return nearbyTournaments
}

export function between(
  startDate: Date,
  endDate: Date
): Prisma.TournamentWhereInput {
  const now = new Date()

  if (!startDate && !endDate) {
    return undefined
  }

  // Cannot pass dates past today
  if (isBefore(startDate, now)) {
    return undefined
  }

  // Only one date has been passed
  if (startDate && !endDate) {
    return {
      start_at: {
        gte: startDate || undefined,
        lt: addDays(startDate, 1)
      }
    }
  }

  // If we have a backward date, simply reverse it
  if (isBefore(endDate, startDate)) {
    return {
      start_at: {
        gte: endDate || undefined,
        lt: startDate || undefined
      }
    }
  }

  return {
    start_at: {
      gte: startDate || undefined,
      lt: endDate || undefined
    }
  }
}
