import { RoleEnum } from "@prisma/client"
import { ForbiddenError } from "apollo-server"
import { skip } from "graphql-resolvers"
import { hasRole } from "../utils/roles"

export const isTO = (_, __, { user }) => {
  if (hasRole(user.roles, RoleEnum.TOURNAMENT_ORGANIZER)) {
    return skip
  }
  
  throw new ForbiddenError("Not a tournament organizer")
}