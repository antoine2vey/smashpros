import { Battle, Prisma } from '@prisma/client'
import { addDays, isBefore, nextDay } from 'date-fns'
import { connectionPlugin } from 'nexus'
import { Polygon, Tournament, Zone } from '../mongo'
import { cache, cacheKeys } from '../redis'
import logger from './logger'

export function mapIdsToPrisma(ids: string[]) {
  return ids.map((id) => ({ id }))
}

export function getCharacterQuery(characters: string[] | undefined) {
  if (!characters || characters.length === 0) {
    return undefined
  }

  return {
    some: {
      OR: mapIdsToPrisma(characters)
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

export async function tournamentsByZone(zone: string | null) {
  let nearbyTournaments: number[] = undefined

  if (zone) {
    // Find all polygons in zone
    try {
      const polygons = await Polygon.find({ zone }).sort('-vertices')
      const bulk = []
      const tournaments: number[] = []

      // If we found any polygons
      if (polygons.length) {
        // Get all tournaments that are in all polygons
        for (let polygon of polygons) {
          const tournaments = Tournament.find({})
            .where('location')
            .within(polygon)
          bulk.push(tournaments)
        }

        // Batch all results
        const results = await Promise.all(bulk)
        const foundTournaments = results.flat()

        for (let tournament of foundTournaments) {
          tournaments.push(tournament.ref)
        }

        // Return references if we have tournaments, array is empty since we have found nothing
        return tournaments
      }
    } catch (error) {
      logger.error(error.message)
      return []
    }
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

  return {
    start_at: {
      gte: startDate || undefined,
      lt: endDate || undefined
    }
  }
}
