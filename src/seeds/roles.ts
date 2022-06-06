import { RoleEnum } from '@prisma/client'
import { prisma } from '../prisma'
import logger from '../utils/logger'

const roles: RoleEnum[] = [
  RoleEnum.ADMIN,
  RoleEnum.TOURNAMENT_ORGANIZER,
  RoleEnum.CREW_ADMIN,
  RoleEnum.USER
]

export function loadRoles() {
  logger.info('Creating roles ...')
  const batch = []

  for (let name of roles) {
    const promise = prisma.role.create({ data: { name } })
    batch.push(promise)
  }

  return prisma.$transaction(batch)
}
