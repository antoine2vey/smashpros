import { RoleEnum } from '@prisma/client'
import { ForbiddenError } from 'apollo-server'
import { hasRole } from '../utils/roles'

export const isTO = (_, __, { user }) => {
  if (hasRole(user.roles, RoleEnum.TOURNAMENT_ORGANIZER)) {
    return true
  }

  throw new ForbiddenError('Not a tournament organizer')
}
