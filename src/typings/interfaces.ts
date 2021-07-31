import { Character, Role, User } from "@prisma/client";
import { ReadStream } from "fs";

export interface Tournament {
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
  characterId: string
}

export interface UserCreateInput {
  id: string
  password: string
  email: string
  tag: string
  profilePicture: {
    file: Promise<{
      filename: string
      mimetype: string
      encoding: string
      createReadStream: () => AWS.S3.Body
    }>
  }
  characters: string[]
}

export interface UserUpdateInput extends UserCreateInput {
  prefix: string
}