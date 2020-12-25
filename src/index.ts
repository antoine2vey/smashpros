import { ApolloServer, AuthenticationError, mergeSchemas } from 'apollo-server'
import { typeDefs as schemas } from './typedefs';
import { resolvers } from './resolvers'
import { ensureBucketExists } from './utils/aws'
import { decode } from 'jsonwebtoken'
import { prisma } from './prisma';

const schema = mergeSchemas({
  schemas,
  resolvers
})

const server = new ApolloServer({
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
  // await ensureBucketExists(process.env.S3_USER_BUCKET)

  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 WebSockets ready at ${subscriptionsUrl}`);
});
