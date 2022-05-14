import { idArg, list, nonNull, objectType, stringArg } from 'nexus'
import { isAuthenticated, authorizations } from '../authorizations'
import {
  user,
  crew,
  crews,
  characters,
  tournaments,
  tournament,
  users,
  suggestedName,
  matches,
  match
} from '../resolvers'
import { SuggestedName } from '.'
import { UserFilter } from './user'
import { relayArgs } from './relay'

export const Query = objectType({
  name: 'Query',
  definition: (t) => {
    // Characters
    t.field('characters', {
      type: list('Character'),
      resolve(...args) {
        return characters(...args)
      }
    })

    // Crew
    t.field('crews', {
      type: list('Crew'),
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return crews(...args)
      }
    })

    t.field('crew', {
      type: 'Crew',
      authorize: authorizations(isAuthenticated),
      args: {
        id: idArg()
      },
      resolve(...args) {
        return crew(...args)
      }
    })

    // Tournament
    t.field('tournaments', {
      type: 'TournamentConnection',
      authorize: authorizations(isAuthenticated),
      args: relayArgs,
      resolve(...args) {
        return tournaments(...args)
      }
    })

    t.field('tournament', {
      type: 'Tournament',
      authorize: authorizations(isAuthenticated),
      args: {
        id: nonNull(idArg())
      },
      resolve(...args) {
        return tournament(...args)
      }
    })

    // User
    t.field('user', {
      type: 'User',
      authorize: authorizations(isAuthenticated),
      args: {
        id: idArg()
      },
      resolve(...args) {
        return user(...args)
      }
    })

    t.field('users', {
      type: 'UserConnection',
      authorize: authorizations(isAuthenticated),
      args: {
        ...relayArgs,
        filters: nonNull(UserFilter)
      },
      resolve(...args) {
        return users(...args)
      }
    })

    t.field('suggestedName', {
      type: SuggestedName,
      args: {
        slug: nonNull(stringArg())
      },
      resolve(...args) {
        return suggestedName(...args)
      }
    })

    // Single match
    t.field('match', {
      type: 'Match',
      authorize: authorizations(isAuthenticated),
      args: {
        id: nonNull(idArg())
      },
      resolve(...args) {
        return match(...args)
      }
    })

    // Matches
    t.field('matches', {
      type: 'MatchConnection',
      authorize: authorizations(isAuthenticated),
      args: relayArgs,
      resolve(...args) {
        return matches(...args)
      }
    })
  }
})
