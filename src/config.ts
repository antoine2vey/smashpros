import { findUserByToken } from './utils/user';
import { makeSchema } from 'nexus';
import path from 'path';
import * as types from './schema'
import { prisma } from './prisma';

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, '..', 'generated', 'schema.graphql'),
    typegen: path.join(__dirname, '..', 'generated', 'typegen.d.ts'),
  },
})

export const config = {
  schema,
  uploads: false,
  context: async ({ req }) => {
    // @ts-ignore
    const user = await findUserByToken(req.headers.authorization)
    return {
      user,
      prisma
    }
  },
}