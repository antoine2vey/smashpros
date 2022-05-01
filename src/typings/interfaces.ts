import { Character, Role, User } from '@prisma/client'
import { ReadStream } from 'fs'
import { FieldResolver } from 'nexus'
import { Readable } from 'stream'
import { NexusGenArgTypes } from '../../generated/typegen'

export type QueryArg<T extends string> = FieldResolver<'Query', T>
export type MutationArg<T extends string> = FieldResolver<'Mutation', T>

export interface PageInfo {
  total: number
  totalPages: number
  page: number
  perPage: number
}

export interface IEvent {
  id: number
  name: string
  numEntrants: number
  entrants: {
    pageInfo: PageInfo
    nodes: {
      participants:
        | [
            {
              player: {
                id: number
              }
            }
          ]
        | []
    }[]
  }
}

export interface ITournament {
  id: number
  event_id: number
  name: string
  lat: number
  lng: number
  tournament_id: string
  city?: string
  countryCode: string
  createdAt: number
  currency: string
  numAttendees: number
  startAt: number
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
  events: IEvent[]
  url: string
  tier: string

  participants?: (User & {
    characters: Character[]
    roles: Role[]
  })[]
  favorited_by?: (User & {
    characters: Character[]
    roles: Role[]
  })[]
}

export interface PlayerByCharacterParams {
  id: string
}

export interface UserCreateInput {
  password: string
  email: string
  tag: string
  profilePicture: Promise<{
    filename: string
    mimetype: string
    encoding: string
    createReadStream: () => Readable
  }>
  characters: string[]
}

export interface UserUpdateInput extends UserCreateInput {
  id: string
}

export namespace SmashGG {
  export interface User {
    id: number
    discriminator: string
    player: {
      id: number
      gamerTag: string
      prefix: string
    }
    tournaments: {
      nodes: {
        name: string
        startAt: string
        id: number
      }[]
    }
    images: {
      url: string
    }[]
  }

  export interface Tournament {
    tournaments: {
      pageInfo: PageInfo
      nodes: ITournament[]
    }
  }

  export interface Event {
    event: IEvent
  }

  export interface EventArgs {
    page: number
    id: number
  }

  export interface TournamentArgs {
    page: number
  }
}
