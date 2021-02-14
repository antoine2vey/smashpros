import { RoleEnum } from "@prisma/client";
import { prisma } from "../prisma";
import logger from "../utils/logger";

const createRoles = []

const roles: RoleEnum[] = [
  RoleEnum.ADMIN,
  RoleEnum.TOURNAMENT_ORGANIZER,
  RoleEnum.CREW_ADMIN,
  RoleEnum.USER
]

for (let name of roles) {
  const promise = prisma.role.create({ data: { name } })
  createRoles.push(promise)
} 

export async function loadRoles() {
  logger.info('Creating roles ...')
  await Promise.all(createRoles)
    .then(() => {
      logger.info('Roles created !')
    })
    .catch((error) => {
      logger.error('Error during role creation', error)
    })
}

loadRoles()
  .finally(() => {
    process.exit(0)
  })