import { AuthenticationError } from 'apollo-server'

export const isAuthenticated = (_, __, { user }) => {
  if (!user) {
    throw new AuthenticationError('Not authenticated')
  }

  return true
}
