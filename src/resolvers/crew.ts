import { RoleEnum } from "@prisma/client";
import { prisma } from "../prisma";
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated, isNotCrewAdmin } from "../middlewares";
import { getRole } from "../utils/roles";
import { isCrewAdmin } from "../middlewares/isNotCrewAdmin";
import { UserInputError } from "apollo-server";
import { updateMemberSchema } from "../validations/crew";
import { CrewUpdateAction } from "../typings/enums";

const crew = async (_, __, { user }) => {
  if (!user.crew_id) {
    return null
  }

  return prisma.crew.findUnique({
    where: {
      id: user.crew_id
    },
    include: {
      members: {
        include: {
          characters: true,
          roles: true
        }
      },
      waiting_members: true,
    }
  })
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

  const crew = await prisma.crew.create({
    data: {
      name,
      prefix,
      members: {
        connect: [{ id: user.id }]
      },
      banner: '',
      icon: ''
    },
    include: {
      members: true
    }
  })

  await prisma.user.update({
    where: { id: user.id },
    data: {
      roles: {
        connect: [{ id: CREW_ADMIN_ROLE.id }]
      }
    }
  })

  return crew
}

const joinCrew = async (_, { id }: { id: string }, { user }) => {
  if (user.crew_id) {
    return null
  }

  return prisma.crew.update({
    where: {
      id
    },
    data: {
      waiting_members: {
        connect: [{ id: user.id }]
      }
    }
  })
}

const updateWaitingMember = async (_, { id, action }: { id: string, action: CrewUpdateAction }, { user }) => {
  const { error } = updateMemberSchema.validate(action)

  if (error) {
    throw new UserInputError(error.message)
  }

  return prisma.crew.update({
    where: { id: user.crew_id },
    data: {
      waiting_members: {
        disconnect: [{ id }]
      },
      members: {
        // Switch user to members if he is accepted, else do not connect
        connect: action === CrewUpdateAction.ACCEPT ? [{ id }] : []
      }
    },
    include: {
      waiting_members: true,
      members: true
    }
  })
}

const kickMember = async (_, { id }: { id: string }, { user }) => {
  return prisma.crew.update({
    where: { id: user.crew_id },
    data: {
      members: {
        disconnect: [{ id }]
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
    ),
  },
  Mutation: {
    createCrew: combineResolvers(
      isAuthenticated,
      isNotCrewAdmin,
      createCrew
    ),
    joinCrew: combineResolvers(
      isAuthenticated,
      joinCrew
    ),
    updateWaitingMember: combineResolvers(
      isAuthenticated,
      isCrewAdmin,
      updateWaitingMember
    ),
    kickMember: combineResolvers(
      isAuthenticated,
      isCrewAdmin,
      kickMember
    )
  }
}