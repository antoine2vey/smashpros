import { gql } from 'graphql-request'
import { PubSub } from '../typings/enums'
import { prisma } from '../prisma'
import { cache, cacheKeys, pubsub } from '../redis'
import { MutationArg, QueryArg, SmashGG } from '../typings/interfaces'
import smashGGClient from '../smashGGClient'
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { Prisma } from '@prisma/client'
import { between, getSpatialTournaments } from '../utils/prisma'

export const tournaments: QueryArg<'tournaments'> = async (
  _,
  { filters, ...args },
  ctx,
  info
) => {
  let nearbyTournaments: number[] = undefined
  let dateBoundaries: Prisma.TournamentWhereInput = undefined

  if (filters) {
    const { lat, lng, radius, endDate, startDate } = filters

    dateBoundaries = between(startDate, endDate)
    nearbyTournaments = await getSpatialTournaments(lat, lng, radius)
  }

  /**
   * Get all tournaments that are after end_at
   * else means tournament has ended, don't show it
   */
  const baseArgs: Prisma.TournamentFindManyArgs = {
    where: {
      tournament_id: { in: nearbyTournaments },
      AND: [
        dateBoundaries,
        {
          end_at: {
            gte: new Date()
          }
        }
      ]
    },
    include: {
      participants: {
        where: {
          allow_searchability: true
        }
      },
      favorited_by: {
        where: {
          allow_searchability: true
        }
      }
    },
    orderBy: [
      {
        start_at: 'asc'
      },
      {
        name: 'asc'
      }
    ]
  }

  return findManyCursorConnection(
    (args) =>
      prisma.tournament.findMany({
        ...args,
        ...baseArgs
      }),
    () => prisma.tournament.count({ where: baseArgs.where }),
    args
  )
}

export const tournament: QueryArg<'tournament'> = async (
  _,
  args,
  ctx,
  info
) => {
  return prisma.tournament.findUnique({
    where: {
      id: args.id
    },
    include: {
      favorited_by: {
        where: {
          allow_searchability: true
        },
        include: {
          characters: true
        }
      }
    }
  })
}

export const favoriteTournament: MutationArg<'favoriteTournament'> = async (
  _,
  { id, unfavorite },
  ctx,
  info
) => {
  const action = unfavorite ? 'disconnect' : 'connect'

  await prisma.tournament.update({
    where: {
      id
    },
    data: {
      favorited_by: {
        [action]: [{ id: ctx.user.id }]
      }
    }
  })

  return true
}

export const participateTournament: MutationArg<
  'participateTournament'
> = async (_, { id, unparticipate }, ctx, info) => {
  const action = unparticipate ? 'disconnect' : 'connect'

  return prisma.tournament.update({
    include: {
      participants: {
        include: {
          characters: true
        }
      },
      favorited_by: {
        include: {
          characters: true
        }
      }
    },
    where: {
      id
    },
    data: {
      participants: {
        [action]: [{ id: ctx.user.id }]
      }
    }
  })
}

export const checkUserIn: MutationArg<'checkUserIn'> = async (
  _,
  { participant, tournament },
  { user },
  info
) => {
  // Geet tournament where user is an organizer, we alreeady checked his role
  const tourney = await prisma.tournament.findFirst({
    where: {
      id: tournament,
      participants: {
        some: {
          id: participant,
          is_checked_in: false
        }
      },
      organizers: {
        some: {
          id: user.id
        }
      }
    }
  })

  if (tourney) {
    await prisma.user.update({
      where: { id: participant },
      data: { is_checked_in: true }
    })

    return true
  }

  return false
}

export const userEnteredTournament: MutationArg<
  'userEnteredTournament'
> = async (_, { tournament }, { user }, info) => {
  const update = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      in_tournament: true
    },
    include: {
      characters: true,
      roles: true
    }
  })

  pubsub.publish(PubSub.Actions.USER_ENTERED_TOURNAMENT, { user: update })
  return update
}

export const userLeftTournament: MutationArg<'userLeftTournament'> = async (
  _,
  { tournament },
  { user },
  info
) => {
  const update = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      in_tournament: false
    },
    include: {
      characters: true,
      roles: true
    }
  })

  pubsub.publish(PubSub.Actions.USER_LEFT_TOURNAMENT, { user: update })
  return update
}

export const synchronizeTournaments: MutationArg<
  'synchronizeTournaments'
> = async (_, {}, { user }, info) => {
  const { smashgg_slug, id } = user
  const query = gql`
    query userTournaments($slug: String!) {
      user(slug: $slug) {
        tournaments(
          query: { filter: { videogameId: 1386, upcoming: true }, perPage: 500 }
        ) {
          nodes {
            id
            name
          }
        }
      }
    }
  `
  // Get all tournaments for the smashGG user
  const {
    user: { tournaments }
  } = await smashGGClient.request<{ user: SmashGG.User }, { slug: string }>(
    query,
    { slug: smashgg_slug }
  )
  const tournamentsId = tournaments.nodes.map((tournament) => tournament.id)
  // Find all tournaments that matches DB ones
  const foundTournaments = await prisma.tournament.findMany({
    where: {
      tournament_id: { in: tournamentsId }
    }
  })

  // Register user for all DB tournaments
  await prisma.user.update({
    where: {
      id
    },
    data: {
      tournaments: {
        connect: foundTournaments.map((tournament) => ({ id: tournament.id }))
      }
    }
  })

  return foundTournaments
}
