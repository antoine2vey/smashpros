import { Date as DateScalar } from './scalars/date';
import { typeDefs as schemas } from './typedefs';
import { resolvers } from './resolvers'
import { IResolversParameter, mergeSchemas } from 'apollo-server';
import { findUserByToken } from './utils/user';
import { GraphQLUpload } from 'graphql-upload';

export const schema = mergeSchemas({
  schemas,
  resolvers: resolvers as IResolversParameter
})

export const config = {
  resolvers: {
    Date: DateScalar,
    Upload: GraphQLUpload
  },
  schema,
  uploads: false,
  context: async ({ req }) => {
    // @ts-ignore
    const user = await findUserByToken(req.headers.authorization)
    return {
      user
    }
  }
}