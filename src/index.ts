import express from 'express'
import { runAtMidnight } from './utils/cron'
import { executeTournamentsQueries } from './backgroundTasks/tournaments'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import { findUserByToken } from './utils/user'
import { config, schema } from './config'
import { graphqlUploadExpress } from 'graphql-upload'
import { ensureBucketExists } from './utils/storage'
import { engine } from 'express-handlebars'
import path from 'path'
import responseCachePlugin from 'apollo-server-plugin-response-cache'

import { Server } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { prisma } from './prisma'
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginDrainHttpServer
} from 'apollo-server-core'
import { Context } from 'graphql-ws'
import { connectMongo } from './mongo'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import { cache } from './redis'

const app = express()
const httpServer = createServer(app)

const wss = new Server({
  server: httpServer,
  path: '/graphql'
})

const serverCleanup = useServer(
  {
    schema,
    context: async (
      { connectionParams }: Context<{ authorization: string | null }>,
      msg,
      args
    ) => {
      if (connectionParams?.authorization) {
        const user = await findUserByToken(connectionParams.authorization)
        return {
          user,
          prisma
        }
      }

      return {
        user: null
      }
    }
  },
  wss
)

const server = new ApolloServer({
  ...config,
  cache: new BaseRedisCache({
    client: cache
  }),
  plugins: [
    // For 'PRIVATE' cache hit, identify by user.id
    responseCachePlugin({
      sessionId: ({ context }) => {
        if (context.user) {
          return context.user.id
        }
        return null
      }
    }),
    // Default cache-control is 60 seconds
    ApolloServerPluginCacheControl({
      defaultMaxAge: 5
    }),
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          }
        }
      }
    }
  ]
})

server.start().then(async () => {
  // Connect to mongo database
  await connectMongo()

  app.use(graphqlUploadExpress())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  // app.use(express.static('public'))

  app.engine('handlebars', engine())
  app.set('view engine', 'handlebars')
  app.set('views', path.join(__dirname, 'views'))

  app.disable('x-powered-by')

  app.get('/reset', (req, res) => {
    const token = req.query.token

    res.render('reset', {
      token
    })
  })

  server.applyMiddleware({
    app
  })

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 GraphQL endpoint ready at ${server.graphqlPath}`)
    console.log(
      `Open GQL debugger at https://studio.apollographql.com/sandbox/explorer`
    )
    // runAtMidnight(executeTournamentsQueries)
  })
})
