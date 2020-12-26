import { combineResolvers } from "graphql-resolvers"
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

const tournament = async (_, { id }: { id: string }) => {
  return prisma.tournament.findUnique({
    where: {
      id
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

export const tournamentResolver = {
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