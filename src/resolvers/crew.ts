import { RoleEnum } from "@prisma/client";
import { prisma } from "../prisma";
import { getRole } from "../utils/roles";
import { ForbiddenError, UserInputError } from "apollo-server";
import { updateMemberSchema } from "../validations/crew";
import { CrewUpdateAction } from "../typings/enums";
import { MutationArg, QueryArg } from "../typings/interfaces";

export const crew: QueryArg<"crew"> = async (_, args, { user, prisma }, info) => {
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

export const crews: QueryArg<"crews"> = (_, args, ctx, info) => {
  return prisma.crew.findMany({
    include: {
      members: true
    }
  })
}

export const createCrew: MutationArg<"createCrew"> = async (_, { name, prefix }, { user }, info) => {
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

export const joinCrew: MutationArg<"joinCrew"> = async (_, { id }, { user }, info) => {
  if (user.crew_id) {
    throw new ForbiddenError('You already have a crew')
  }

  return prisma.crew.update({
    where: {
      id
    },
    data: {
      waiting_members: {
        connect: [{ id: user.id }]
      }
    },
    include: {
      members: true,
      waiting_members: true
    }
  })
}

export const updateWaitingMember: MutationArg<"updateMember"> = async (_, { id, action }, { user }, info) => {
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

export const kickMember: MutationArg<"kickMember"> = async (_, { id }, { user }, info) => {
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