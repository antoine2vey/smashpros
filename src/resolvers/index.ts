import { characterResolver } from './character'
import { userResolver } from './user'

export const resolvers = [
  userResolver,
  characterResolver
]