import { prisma } from "../prisma";
import { combineResolvers } from 'graphql-resolvers'

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