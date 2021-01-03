import { RoleEnum } from '@prisma/client'
import { ForbiddenError } from 'apollo-server'
import { skip } from 'graphql-resolvers'
import { hasNotRole } from '../utils/roles'

export const isAdmin = (_, __, { user }) => {
  if (hasNotRole(user.roles, RoleEnum.ADMIN)) {
    throw new ForbiddenError("No rights to do that")
  }
  
  return skip
}
