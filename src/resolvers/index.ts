import { characterResolver } from './character'
import { crewResolver } from './crew'
import { tournamentResolver } from './tournament'
import { userResolver } from './user'

export const resolvers = [
  userResolver,
  characterResolver,
  tournamentResolver,
  crewResolver
]