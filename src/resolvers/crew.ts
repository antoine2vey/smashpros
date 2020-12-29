import { RoleEnum } from "@prisma/client";
import { prisma } from "../prisma";
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated, isNotCrewAdmin } from "../middlewares";
import { getRole } from "../utils/roles";

export interface AddCharacter {
  name: string
  picture: string
}

const crew = (_, { id }) => {
  return prisma.crew.findUnique({ where: { id }})
}

const crews = () => {
  return prisma.crew.findMany({
    include: {
      members: true
    }
  })
}

const createCrew = async (_, { name, prefix }: { name: string, prefix: string }, { user }) => {
  const CREW_ADMIN_ROLE = await getRole(RoleEnum.CREW_ADMIN)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      roles: {
        connect: [{ id: CREW_ADMIN_ROLE.id }]
      }
    }
  })

  return prisma.crew.create({
    data: {
      name,
      prefix,
      members: {
        connect: [{ id: user.id }]
      }
    },
    include: {
      members: true
    }
  })
}

export const crewResolver = {
  Query: {
    crews: combineResolvers(
      isAuthenticated,
      crews
    ),
    crew: combineResolvers(
      isAuthenticated,
      crew
    )
  },
  Mutation: {
    createCrew: combineResolvers(
      isAuthenticated,
      isNotCrewAdmin,
      createCrew
    )
  }
}