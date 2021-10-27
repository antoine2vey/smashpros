import { idArg, list, nonNull, objectType } from "nexus";
import { Context } from "../context";
import { isAuthenticated, authorizations } from "../authorizations";
import { crew, crews, characters, tournaments, tournament, usersByCharacter } from "../resolvers";

export const Query = objectType({
  name: 'Query',
  definition: (t) => {
    // Characters
    t.field('characters', {
      type: list('Character'),
      authorize: authorizations(isAuthenticated),
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
    t.field('tournaments', {
      type: list(nonNull('Tournament')),
      authorize: authorizations(isAuthenticated),
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
  }
})