import { RoleEnum } from '@prisma/client'
import { ForbiddenError } from 'apollo-server'
import { skip } from 'graphql-resolvers'
import { hasRole } from '../utils/roles'

export const isNotCrewAdmin = (_, __, { user }) => {
  if (hasRole(user.roles, RoleEnum.CREW_ADMIN)) {
    throw new ForbiddenError("Already a crew admin")
  }
  
  return skip
}
