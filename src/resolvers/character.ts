import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { combineResolvers } from 'graphql-resolvers'
import { isAdmin, isAuthenticated } from "../middlewares";

export interface AddCharacter {
  name: string
  picture: string
}

const characters = () => {
  return prisma.character.findMany()
}

const addCharacter = (_, { name, picture }: Prisma.CharacterCreateInput) => {
  return prisma.character.create({
    data: {
      name,
      picture
    }
  })
}

export const characterResolver = {
  Query: {
    characters: combineResolvers(
      characters
    )
  },
  Mutation: {
    addCharacter: combineResolvers(
      isAuthenticated,
      isAdmin,
      addCharacter
    )
  }
}