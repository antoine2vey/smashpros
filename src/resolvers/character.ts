import { Prisma } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import { prisma } from "../prisma";

export interface AddCharacter {
  name: string
  picture: string
}

export const characterResolver = {
  Query: {
    characters: () => {
      return prisma.character.findMany()
    }
  },
  Mutation: {
    addCharacter: (_, { name, picture }: Prisma.CharacterCreateInput) => {
      return prisma.character.create({
        data: {
          name,
          picture
        }
      })
    }
  }
}