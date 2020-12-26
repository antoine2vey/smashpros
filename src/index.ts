import { ApolloServer, IResolversParameter, mergeSchemas } from 'apollo-server'
import { typeDefs as schemas } from './typedefs';
import { resolvers } from './resolvers'
import { ensureBucketExists } from './utils/aws'
import { decode } from 'jsonwebtoken'
import { prisma } from './prisma';
import { Date } from './scalars/date';

const schema = mergeSchemas({
  schemas,
  resolvers: resolvers as IResolversParameter
})

const server = new ApolloServer({
  resolvers: {
    Date: Date
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
    const user = now > exp ? await prisma.user.findUnique({ where: { id: userId }}) : null

    return {
      user
    }
  }
});

server.listen().then(async ({ url, subscriptionsUrl }) => {
  if (process.env.NODE_ENV === 'production') {
    await ensureBucketExists(process.env.S3_USER_BUCKET)
  }

  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 WebSockets ready at ${subscriptionsUrl}`);
});
