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

import { Server } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { prisma } from './prisma'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { Context } from 'graphql-ws'

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
      if (connectionParams.authorization) {
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
  schema,
  uploads: false,
  context: async ({ req }) => {
    const user = await findUserByToken(req.headers.authorization)
    return {
      user,
      prisma,
      req
    }
  },
  plugins: [
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
  app.use(graphqlUploadExpress())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  // app.use(express.static('public'))

  app.engine('handlebars', engine())
  app.set('view engine', 'handlebars')
  app.set('views', path.join(__dirname, 'views'))

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
      `🚀 GraphQL subscription endpoint ready at ${server.subscriptionsPath}`
    )
    console.log(
      `Open GQL debugger at https://studio.apollographql.com/sandbox/explorer`
    )
    // runAtMidnight(executeTournamentsQueries)
  })
})
