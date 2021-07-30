import { IResolversParameter, mergeSchemas } from 'apollo-server'
import express from 'express'
import { typeDefs as schemas } from './typedefs';
import { resolvers } from './resolvers'
import { decode } from 'jsonwebtoken'
import { prisma } from './prisma';
import { Date as DateScalar } from './scalars/date';
import { runAtMidnight } from './utils/cron';
import { executeTournamentsQueries } from './backgroundTasks/tournaments'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import { findUserByToken } from './utils/user';

const schema = mergeSchemas({
  schemas,
  resolvers: resolvers as IResolversParameter
})

const server = new ApolloServer({
  resolvers: {
    Date: DateScalar
  },
  schema,
  context: async ({ req }) => {
    // @ts-ignore
    const user = await findUserByToken(req.headers.authorization)
    return {
      user
    }
  }
});

server.start().then(async () => {
  const app = express()
  const httpServer = createServer(app)
  
  SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: async (params) => {
      if (params.authorization) {
        const user = await findUserByToken(params.authorization)
        return {
          user
        }
      }
    }
  }, {
    server: httpServer,
    path: server.graphqlPath
  })

  server.applyMiddleware({
    app,
    path: '/'
  })

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 GraphQL endpoint ready at ${server.graphqlPath}`);
    // runAtMidnight(executeTournamentsQueries)
  })
})