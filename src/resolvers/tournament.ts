import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "lodash"
import { PubSubActions } from "../typings/enums"
import { isAuthenticated } from "../middlewares"
import { isTO } from "../middlewares/isTO"
import { prisma } from "../prisma"
import { pubsub } from "../redis"
import { Tournament } from "../typings/interfaces"

const tournaments = async () => {
  return prisma.tournament.findMany({
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
    }
  })
}

const tournament = async (_, args: { id: string }, ctx, info) => {
  return prisma.tournament.findUnique({
    where: {
      id: args.id
    },
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
    }
  })
}

const favoriteTournament = async (_, { id, unfav }: { id: string, unfav: boolean }, ctx) => {
  const action = unfav ? 'disconnect' : 'connect'

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

const participateTournament = async (_, { id, unparticipate }: { id: string, unparticipate?: boolean }, ctx) => {
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
        [action]: [{ id: ctx.user.id }]
      }
    }
  })
}

const participants = (tournament: Tournament, { query }) => {
  if (isEmpty(query)) {
    // Return all participants if no filter
    return tournament.participants
  }

  const { character, player }: { character: string; player: string } = query
  return tournament.participants.filter(participant => {
    if (character) {
      return participant.characters.some(char => char.id === character)
    }

    if (player) {
      return participant.tag.includes(player)
    }

    return true
  })
}

const checkUserIn = async (_, { participant, tournament }: { participant: string, tournament: string }, { user }) => {
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

const userEnteredTournament = async (_, { tournament }: { tournament: string }, { user }) => {
  const update = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      in_tournament: true,
    },
    include: {
      characters: true,
      roles: true
    }
  })

  pubsub.publish(PubSubActions.USER_ENTERED_TOURNAMENT, { userEnteredTournament: update })
  return update
}

export const tournamentResolver = {
  Tournament: {
    participants
  },
  Query: {
    tournaments: combineResolvers(
      isAuthenticated,
      tournaments
    ),
    tournament: combineResolvers(
      isAuthenticated,
      tournament
    )
  },
  Mutation: {
    favoriteTournament: combineResolvers(
      isAuthenticated,
      favoriteTournament
    ),
    participateTournament: combineResolvers(
      isAuthenticated,
      participateTournament
    ),
    checkUserIn: combineResolvers(
      isAuthenticated,
      isTO,
      checkUserIn
    ),
    userEnteredTournament: combineResolvers(
      isAuthenticated,
      userEnteredTournament
    )
  }
}