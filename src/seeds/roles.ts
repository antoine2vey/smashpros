import { RoleEnum } from "@prisma/client";
import { prisma } from "../prisma";
import logger from "../utils/logger";

export function loadRoles() {
  logger.info('Creating roles ...')

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

  return Promise.all(createRoles)
}

loadRoles()
  .then(() => {
    logger.info('Roles created !')
  })
  .catch((error) => {
    logger.error('Error during role creation', error)
  })
  .finally(() => {
    process.exit(0)
  })