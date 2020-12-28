import { combineResolvers } from "graphql-resolvers"
import { isEmpty } from "lodash"
import { isAuthenticated } from "../middlewares"
import { prisma } from "../prisma"

export interface Tournament {
  id: number    
  name: string    
  lat: number
  lng: number
  tournament_id: string    
  city: string
  countryCode: string
  createdAt: number
  currency: string
  numAttendees: number
  endAt: number
  eventRegistrationClosesAt: number
  hasOfflineEvents?: boolean
  images: {
    id: string
    url: string
  }[]
  isRegistrationOpen?: boolean
  slug: string
  state: number
  venueName?: string
  venueAddress?: string

  participants?: any[]
  favorited_by?: any[]
}

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
  return prisma.tournament.findFirst({
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
    )
  }
}