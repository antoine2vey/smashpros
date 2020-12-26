import { User } from '@prisma/client'
import { ForbiddenError } from 'apollo-server'
import { skip } from 'graphql-resolvers'

export const isAdmin = (root, args, { user }: { user: User }) => {
  if (user.role === "ADMIN") {
    throw new ForbiddenError("No rights to do that")
  }
  
  return skip
}
