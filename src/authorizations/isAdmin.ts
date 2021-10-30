import { RoleEnum } from '@prisma/client'
import { ForbiddenError } from 'apollo-server'
import { hasNotRole } from '../utils/roles'

export const isAdmin = (_, __, { user }) => {
  if (hasNotRole(user.roles, RoleEnum.ADMIN)) {
    throw new ForbiddenError("Not enough rights to do that")
  }
  
  return true
}