import express from 'express'
import { runAtMidnight } from './utils/cron';
import { executeTournamentsQueries } from './backgroundTasks/tournaments'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import { findUserByToken } from './utils/user';
import { config, schema } from './config';
import { graphqlUploadExpress } from 'graphql-upload';

const server = new ApolloServer(config);

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

  app.use(graphqlUploadExpress())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  server.applyMiddleware({
    app,
    path: '/'
  })

  // app.use((req, res, next) => {
  //   console.log(req)
  //   console.log(res)
  //   next()
  // })
  // app.use(express.urlencoded({ extended: false }))
  // app.use(express.json())

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 GraphQL endpoint ready at ${server.graphqlPath}`);
    // runAtMidnight(executeTournamentsQueries)
  })
})