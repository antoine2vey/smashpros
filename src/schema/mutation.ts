import { arg, booleanArg, idArg, intArg, list, nonNull, objectType, stringArg } from "nexus";
import { CrewCreationPayload, MatchStateEnumType } from ".";
import { authorizations, isAuthenticated, isCrewAdmin, isNotCrewAdmin, isTO } from "../authorizations";
import { checkUserIn, createCrew, favoriteTournament, joinCrew, kickMember, participateTournament, sendMatchInvite, synchronizeTournaments, updateMatchScore, updateMatchState, updateWaitingMember, userEnteredTournament, userLeftTournament } from "../resolvers";
import { askPasswordReset, login, passwordReset, register, updateProfile } from "../resolvers/user";
import { CrewUpdateActionEnum } from "./crew";
import { UserRegisterPayload, UserUpdatePayload } from "./user";

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    // Crew
    t.field('createCrew', {
      type: 'Crew',
      authorize: authorizations(isAuthenticated, isNotCrewAdmin),
      args: {
        payload: nonNull(CrewCreationPayload)
      },
      resolve(...args) {
        return createCrew(...args)
      }
    })

    t.field('joinCrew', {
      type: 'Crew',
      authorize: authorizations(isAuthenticated),
      args: {
        id: nonNull(idArg())
      },
      resolve(...args) {
        return joinCrew(...args) 
      }
    })

    t.field('updateMember', {
      type: 'Crew',
      authorize: authorizations(isAuthenticated, isCrewAdmin),
      args: {
        id: nonNull(idArg()),
        action: nonNull(arg({ type: CrewUpdateActionEnum }))
      },
      resolve(...args) {
        return updateWaitingMember(...args)
      }
    })

    t.field('kickMember', {
      type: 'Crew',
      authorize: authorizations(isAuthenticated, isCrewAdmin),
      args: {
        id: nonNull(idArg())
      },
      resolve(...args) {
        return kickMember(...args)
      }
    })

    // User
    t.field('register', {
      type: 'User',
      args: {
        payload: nonNull(UserRegisterPayload)
      },
      resolve(...args) {
        return register(...args)
      }
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      resolve(...args) {
        return login(...args)
      }
    })

    t.field('updateProfile', {
      type: 'User',
      authorize: authorizations(isAuthenticated),
      args: {
        payload: nonNull(UserUpdatePayload)
      },
      resolve(...args) {
        return updateProfile(...args)
      }
    })

    t.field('askPasswordReset', {
      type: 'String',
      args: {
        email: nonNull(stringArg())
      },
      resolve(...args) {
        return askPasswordReset(...args)
      }
    })

    t.field('passwordReset', {
      type: 'Boolean',
      args: {
        code: nonNull(stringArg()),
        password: nonNull(stringArg()),
        confirmPassword: nonNull(stringArg())
      },
      resolve(...args) {
        return passwordReset(...args)
      }
    })

    // Tournament
    t.field('favoriteTournament', {
      type: 'Boolean',
      authorize: authorizations(isAuthenticated),
      args: {
        id: nonNull(idArg()),
        unfavorite: booleanArg({ default: false })
      },
      resolve(...args) {
        return favoriteTournament(...args)
      }
    })

    t.field('participateTournament', {
      type: 'Tournament',
      authorize: authorizations(isAuthenticated),
      args: {
        id: nonNull(idArg()),
        unparticipate: booleanArg()
      },
      resolve(...args) {
        return participateTournament(...args)
      }
    })

    t.field('checkUserIn', {
      type: 'Boolean',
      authorize: authorizations(isAuthenticated, isTO),
      args: {
        participant: nonNull(idArg()),
        tournament: nonNull(idArg())
      },
      resolve(...args) {
        return checkUserIn(...args)
      }
    })

    t.field('userEnteredTournament', {
      type: 'User',
      authorize: authorizations(isAuthenticated),
      args: {
        tournament: nonNull(idArg())
      },
      resolve(...args) {
        return userEnteredTournament(...args)
      }
    })

    t.field('userLeftTournament', {
      type: 'User',
      authorize: authorizations(isAuthenticated),
      args: {
        tournament: nonNull(idArg())
      },
      resolve(...args) {
        return userLeftTournament(...args)
      }
    })

    t.field('synchronizeTournaments', {
      type: list('Tournament'),
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return synchronizeTournaments(...args)
      }
    })

    // Matches
    t.field('sendMatchInvite', {
      type: 'Match',
      args: {
        to: nonNull(idArg()),
        totalMatches: nonNull(intArg()),
        isMoneymatch: booleanArg(),
        amount: intArg()
      },
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return sendMatchInvite(...args)
      }
    })

    t.field('updateMatchState', {
      type: 'Match',
      args: {
        state: nonNull(MatchStateEnumType),
        id: nonNull(idArg()),
      },
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return updateMatchState(...args)
      }
    })

    t.field('updateMatchScore', {
      type: 'Match',
      args: {
        id: nonNull(idArg()),
        initiatorCharacter: nonNull(idArg()),
        adversaryCharacter: nonNull(idArg())
      },
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return updateMatchScore(...args)
      }
    })
  }
})