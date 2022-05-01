import { RoleEnum } from '@prisma/client'
import { prisma } from '../prisma'
import { getRole } from '../utils/roles'
import { ForbiddenError, UserInputError } from 'apollo-server'
import { updateMemberSchema } from '../validations/crew'
import { CrewActions } from '../typings/enums'
import { MutationArg, QueryArg } from '../typings/interfaces'
import { sizes, uploadFile } from '../utils/storage'
import { randomUUID } from 'crypto'

export const crew: QueryArg<'crew'> = async (
  _,
  { id },
  { user, prisma },
  info
) => {
  let crewId = id ?? user.crew_id ?? null

  if (!crewId) {
    return null
  }

  return prisma.crew.findUnique({
    where: {
      id: crewId
    },
    include: {
      members: {
        include: {
          characters: true,
          roles: true
        }
      },
      waiting_members: true,
      admin: true
    }
  })
}

export const crews: QueryArg<'crews'> = (_, args, ctx, info) => {
  return prisma.crew.findMany({
    include: {
      members: true,
      waiting_members: true,
      admin: true
    }
  })
}

export const createCrew: MutationArg<'createCrew'> = async (
  _,
  { payload },
  { user },
  info
) => {
  const { name, prefix, banner, icon } = payload
  const CREW_ADMIN_ROLE = await getRole(RoleEnum.CREW_ADMIN)
  const bannerStream = await banner
  const iconStream = await icon
  const [bannerUri, iconUri] = await Promise.all([
    uploadFile(
      bannerStream.createReadStream,
      `${randomUUID()}-${bannerStream.filename}`,
      sizes.banner
    ),
    uploadFile(
      iconStream.createReadStream,
      `${randomUUID()}-${iconStream.filename}`,
      sizes.crew
    )
  ])

  const [crew] = await prisma.$transaction([
    prisma.crew.create({
      data: {
        name,
        prefix,
        members: {
          connect: [{ id: user.id }]
        },
        admin: {
          connect: {
            id: user.id
          }
        },
        banner: bannerUri,
        icon: iconUri
      },
      include: {
        members: true
      }
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        roles: {
          connect: [{ id: CREW_ADMIN_ROLE.id }]
        }
      }
    })
  ])

  return crew
}

export const joinCrew: MutationArg<'joinCrew'> = async (
  _,
  { id },
  { user },
  info
) => {
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
      waiting_members: true,
      admin: true
    }
  })
}

export const updateWaitingMember: MutationArg<'updateMember'> = async (
  _,
  { id, action },
  { user },
  info
) => {
  const { error } = updateMemberSchema.validate(action)

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
        connect: action === CrewActions.Update.ACCEPT ? [{ id }] : []
      }
    },
    include: {
      members: true,
      waiting_members: true,
      admin: true
    }
  })
}

export const kickMember: MutationArg<'kickMember'> = async (
  _,
  { id },
  { user }
) => {
  if (user.id === id) {
    throw new UserInputError('Cannot kick yourself from crew')
  }

  return prisma.user.update({
    where: {
      id
    },
    data: {
      crew: {
        disconnect: true
      }
    },
    include: {
      characters: true,
      crew: true
    }
  })
}

export const leaveCrew: MutationArg<'leaveCrew'> = async (_, __, { user }) => {
  return prisma.crew.update({
    where: {
      id: user.crew_id
    },
    data: {
      members: {
        disconnect: { id: user.id }
      }
    },
    include: {
      members: true,
      waiting_members: true,
      admin: true
    }
  })
}

export const transferCrewOwnership: MutationArg<
  'transferCrewOwnership'
> = async (_, { to }, { user }) => {
  const [adminRole, crew] = await Promise.all([
    getRole(RoleEnum.CREW_ADMIN),
    prisma.crew.findUnique({
      where: { id: user.crew_id },
      include: { members: true }
    })
  ])

  // Should never happen
  if (!crew) {
    throw new UserInputError('You have no crew')
  }

  if (crew.admin_id !== user.id) {
    throw new UserInputError('You are trying to update a crew thats not yours')
  }

  // Crew member must be in crew
  if (!crew.members.some((member) => member.id === to)) {
    throw new UserInputError(
      'The user you are trying to promote is not part of your crew'
    )
  }

  // Set admin role to new admin
  await prisma.user.update({
    where: {
      id: to
    },
    data: {
      roles: {
        connect: {
          id: adminRole.id
        }
      }
    }
  })

  return prisma.crew.update({
    where: {
      id: user.crew_id
    },
    data: {
      admin: {
        // Set admin to `to`
        connect: {
          id: to
        },
        update: {
          roles: {
            // Remove old admin role
            disconnect: {
              id: adminRole.id
            }
          }
        }
      }
    },
    include: {
      members: true,
      waiting_members: true,
      admin: true
    }
  })
}
