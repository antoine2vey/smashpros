import { ApolloServer, IResolversParameter, mergeSchemas } from 'apollo-server'
import { typeDefs as schemas } from './typedefs';
import { resolvers } from './resolvers'
import { decode } from 'jsonwebtoken'
import { prisma } from './prisma';
import { Date as DateScalar } from './scalars/date';
import { runAtMidnight } from './utils/cron';
import { executeTournamentsQueries } from './backgroundTasks/tournaments';

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
    const now = +new Date()
    const authorization = req.headers.authorization || ''
    const token = decode(authorization)

    if (!token) {
      return {
        user: null
      }
    }

    // @ts-ignore
    const { exp, userId } = token
    const user = now > exp ? await prisma.user.findUnique({ where: { id: userId }, include: { roles: true }}) : null

    return {
      user
    }
  },
  subscriptions: {
    onConnect: (params, socket) => {
      console.log(params)
      console.log(socket)
    }
  }
});

server.listen().then(async ({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 WebSockets ready at ${subscriptionsUrl}`);

  // runAtMidnight(executeTournamentsQueries)
});
