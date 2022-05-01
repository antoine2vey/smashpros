import express from 'express'
import { runAtMidnight } from './utils/cron'
import { executeTournamentsQueries } from './backgroundTasks/tournaments'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import { findUserByToken } from './utils/user'
import { config, schema } from './config'
import { graphqlUploadExpress } from 'graphql-upload'
import { ensureBucketExists } from './utils/storage'
import { engine } from 'express-handlebars'
import path from 'path'

const server = new ApolloServer(config)

server.start().then(async () => {
  const app = express()
  const httpServer = createServer(app)

  SubscriptionServer.create(
    {
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
    },
    {
      server: httpServer,
      path: server.graphqlPath
    }
  )

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
      `Open GQL debugger at https://studio.apollographql.com/sandbox/explorer`
    )
    // runAtMidnight(executeTournamentsQueries)
  })
})
