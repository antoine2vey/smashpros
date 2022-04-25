import { connectionPlugin, idArg, list, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../context";
import { isAuthenticated, authorizations } from "../authorizations";
import { user, crew, crews, characters, tournaments, tournament, usersByCharacter, suggestedName, matches } from "../resolvers";
import { SuggestedName } from ".";

export const Query = objectType({
  name: 'Query',
  definition: (t) => {
    // Characters
    t.field('characters', {
      type: list('Character'),
      // authorize: authorizations(isAuthenticated),
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
      resolve(...args) {
        return crew(...args)
      }
    })

    // Tournament
    t.connectionField('tournaments', {
      type: 'Tournament',
      authorize: authorizations(isAuthenticated),
      cursorFromNode(node, args, ctx, info) {
        return connectionPlugin.base64Encode(node.tournament_id.toString())
      },
      nodes(...args) {
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

    t.field('usersByCharacter', {
      type: list(nonNull('User')),
      authorize: authorizations(isAuthenticated),
      args: {
        id: nonNull(idArg())
      },
      resolve(...args) {
        return usersByCharacter(...args)
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

    // Matches
    t.connectionField('matches', {
      type: 'Match',
      authorize: authorizations(isAuthenticated),
      cursorFromNode(node, args, ctx, info) {
        return connectionPlugin.base64Encode(node.id)
      },
      nodes(...args) {
        return matches(...args)
      }
    })

    // Battles
    t.field('battles', {
      type: list(nonNull('Battle'))
    })

    // Battles
    t.field('events', {
      type: list(nonNull('Event'))
    })
  }
})