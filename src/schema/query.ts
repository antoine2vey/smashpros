import { idArg, list, nonNull, nullable, objectType, stringArg } from 'nexus'
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
import { TournamentsFilter } from './tournament'
import { zones } from '../resolvers/zone'
import { hoursToSeconds } from 'date-fns'
import { stats } from '../resolvers/stats'

export const Query = objectType({
  name: 'Query',
  definition: (t) => {
    // Characters
    t.field('characters', {
      type: list('Character'),
      resolve(root, args, ctx, info) {
        info.cacheControl.setCacheHint({ maxAge: hoursToSeconds(24) })

        return characters(root, args, ctx, info)
      }
    })

    // Crew
    t.field('crews', {
      type: list('Crew'),
      authorize: authorizations(isAuthenticated),
      resolve(root, args, ctx, info) {
        return crews(root, args, ctx, info)
      }
    })

    t.field('crew', {
      type: 'Crew',
      authorize: authorizations(isAuthenticated),
      args: {
        id: idArg()
      },
      resolve(root, args, ctx, info) {
        return crew(root, args, ctx, info)
      }
    })

    // Tournament
    t.field('tournaments', {
      type: 'TournamentConnection',
      authorize: authorizations(isAuthenticated),
      args: {
        ...relayArgs,
        filters: nullable(TournamentsFilter)
      },
      resolve(root, args, ctx, info) {
        return tournaments(root, args, ctx, info)
      }
    })

    t.field('tournament', {
      type: 'Tournament',
      authorize: authorizations(isAuthenticated),
      args: {
        id: nonNull(idArg())
      },
      resolve(root, args, ctx, info) {
        return tournament(root, args, ctx, info)
      }
    })

    // User
    t.field('user', {
      type: 'User',
      authorize: authorizations(isAuthenticated),
      args: {
        id: idArg()
      },
      resolve(root, args, ctx, info) {
        return user(root, args, ctx, info)
      }
    })

    t.field('users', {
      type: 'UserConnection',
      authorize: authorizations(isAuthenticated),
      args: {
        ...relayArgs,
        filters: nonNull(UserFilter)
      },
      resolve(root, args, ctx, info) {
        return users(root, args, ctx, info)
      }
    })

    t.field('suggestedName', {
      type: SuggestedName,
      args: {
        slug: nonNull(stringArg())
      },
      resolve(root, args, ctx, info) {
        return suggestedName(root, args, ctx, info)
      }
    })

    // Single match
    t.field('match', {
      type: 'Match',
      authorize: authorizations(isAuthenticated),
      args: {
        id: nonNull(idArg())
      },
      resolve(root, args, ctx, info) {
        return match(root, args, ctx, info)
      }
    })

    // Matches
    t.field('matches', {
      type: 'MatchConnection',
      authorize: authorizations(isAuthenticated),
      args: relayArgs,
      resolve(root, args, ctx, info) {
        return matches(root, args, ctx, info)
      }
    })

    // Zones
    t.field('zones', {
      type: list('Zone'),
      authorize: authorizations(isAuthenticated),
      args: {
        countryCode: nonNull(stringArg())
      },
      resolve(root, args, ctx, info) {
        info.cacheControl.setCacheHint({ maxAge: hoursToSeconds(24) })

        return zones(root, args, ctx, info)
      }
    })

    // Stats
    t.field('stats', {
      type: 'Stats',
      authorize: authorizations(isAuthenticated),
      async resolve(root, args, ctx, info) {
        return stats(root, args, ctx, info)
      }
    })
  }
})
