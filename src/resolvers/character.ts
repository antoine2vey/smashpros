import { prisma } from "../prisma";
import { combineResolvers } from 'graphql-resolvers'

export interface AddCharacter {
  name: string
  picture: string
}

const characters = () => {
  return prisma.character.findMany()
}

export const characterResolver = {
  Query: {
    characters: combineResolvers(
      characters
    )
  }
}