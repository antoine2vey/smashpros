import { Character, Role, User } from "@prisma/client";
import { ReadStream } from "fs";
import { FieldResolver } from "nexus";
import { Readable } from "stream";
import { NexusGenArgTypes } from "../../generated/typegen";

export type QueryArg<T extends string> = FieldResolver<"Query", T>
export type MutationArg<T extends string> = FieldResolver<"Mutation", T>

export interface ITournament {
  id: number    
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

  participants?:( User & {
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
  }

  export interface Tournament {
    tournaments: {
      nodes: ITournament[]
    }
  }
}
