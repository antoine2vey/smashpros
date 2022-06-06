import { ApolloServer } from 'apollo-server-express'
import { config } from '../../config'

export const server = new ApolloServer({
  ...config
})
