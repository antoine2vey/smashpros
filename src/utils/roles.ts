import { RoleEnum, Role } from '@prisma/client'
import { prisma } from '../prisma'

export function hasRole(roles: Role[], role: RoleEnum) {
  return roles.some((userRole) => userRole.name === role)
}

export function hasNotRole(roles: Role[], role: RoleEnum) {
  return roles.some((userRole) => userRole.name !== role)
}

export function getRole(role: RoleEnum) {
  return prisma.role.findUnique({ where: { name: role } })
}
