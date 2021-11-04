import { findUserByToken } from './utils/user';
import { fieldAuthorizePlugin, makeSchema } from 'nexus';
import path from 'path';
import * as types from './schema'
import { prisma } from './prisma';

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, '..', 'generated', 'schema.graphql'),
    typegen: path.join(__dirname, '..', 'generated', 'typegen.d.ts'),
  },
  contextType: {
    module: path.resolve(__dirname, 'context.ts'),
    export: "Context"
  },
  plugins: [
    fieldAuthorizePlugin({
      formatError({ error }) {
        return error
      }
    })
  ]
})

export const config = {
  schema,
  uploads: false,
  context: async ({ req }) => {
    const user = await findUserByToken(req.headers.authorization)
    return {
      user,
      prisma
    }
  },
}