import { characterResolver } from './character'
import { tournamentResolver } from './tournament'
import { userResolver } from './user'

export const resolvers = [
  userResolver,
  characterResolver,
  tournamentResolver
]