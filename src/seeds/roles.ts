import { RoleEnum } from "@prisma/client";
import chalk from "chalk";
import { prisma } from "../prisma";

const createRoles = []
const log = (...args) => (colors) => {
  console.log(colors('[SEED]', ...args))
}

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
  log('Creating roles ...')(chalk.bold)
  await Promise.all(createRoles)
    .then(() => {
      log('Roles created !')(chalk.bold.green)
    })
    .catch(() => {
      log('Error during role creation')(chalk.bold.red)
    })
}

loadRoles()
  .finally(() => {
    process.exit(0)
  })