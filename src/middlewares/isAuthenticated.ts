import { AuthenticationError } from 'apollo-server'
import { skip } from 'graphql-resolvers'

export const isAuthenticated = (_, __, { user }) => {
  if (!user) {
    throw new AuthenticationError('Not authenticated')
  }
  
  return skip
}
