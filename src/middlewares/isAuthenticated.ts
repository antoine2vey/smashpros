import { AuthenticationError } from 'apollo-server'
import { skip } from 'graphql-resolvers'

export const isAuthenticated = (root, args, { user }) => user ? skip : new AuthenticationError('Not authenticated')
