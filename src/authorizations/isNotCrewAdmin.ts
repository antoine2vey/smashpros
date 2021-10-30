import { RoleEnum } from '@prisma/client'
import { ForbiddenError } from 'apollo-server'
import { hasRole } from '../utils/roles'

export const isNotCrewAdmin = (_, __, { user }) => {
  if (hasRole(user.roles, RoleEnum.CREW_ADMIN)) {
    throw new ForbiddenError("Already a crew admin")
  }
  
  return true
}

export const isCrewAdmin = (_, __, { user }) => {
  if (hasRole(user.roles, RoleEnum.CREW_ADMIN)) {
    return true
  }
  
  throw new ForbiddenError("Not a crew admin")
}
