import {
  arg,
  booleanArg,
  idArg,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg
} from 'nexus'
import { CrewCreationPayload, MatchStateEnumType } from '.'
import {
  authorizations,
  isAuthenticated,
  isCrewAdmin,
  isNotCrewAdmin,
  isTO
} from '../authorizations'
import {
  checkUserIn,
  createCrew,
  favoriteTournament,
  joinCrew,
  kickMember,
  leaveCrew,
  participateTournament,
  sendMatchInvite,
  synchronizeTournaments,
  transferCrewOwnership,
  updateMatch,
  updateWaitingMember,
  userEnteredTournament,
  userLeftTournament,
  setOnline,
  updateBattle
} from '../resolvers'
import {
  askPasswordReset,
  login,
  passwordReset,
  refresh,
  register,
  updateProfile
} from '../resolvers/user'
import { CrewUpdateActionEnum } from './crew'
import { UserRegisterPayload, UserUpdatePayload } from './user'

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

    t.field('transferCrewOwnership', {
      type: 'Crew',
      authorize: authorizations(isAuthenticated, isCrewAdmin),
      args: {
        to: nonNull(idArg())
      },
      resolve(...args) {
        return transferCrewOwnership(...args)
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

    t.field('leaveCrew', {
      type: 'Crew',
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return leaveCrew(...args)
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
      type: 'User',
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

    t.field('refresh', {
      type: 'RefreshPayload',
      args: {
        refreshToken: nonNull(stringArg())
      },
      resolve(...args) {
        return refresh(...args)
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

    t.field('setOnline', {
      type: 'User',
      authorize: authorizations(isAuthenticated),
      args: {
        online: nonNull(booleanArg())
      },
      resolve(...args) {
        return setOnline(...args)
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
        unfavorite: booleanArg({ default: false })
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
        tournament: idArg(),
        amount: intArg()
      },
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return sendMatchInvite(...args)
      }
    })

    t.field('updateMatch', {
      type: 'Match',
      args: {
        state: nonNull(MatchStateEnumType),
        id: nonNull(idArg())
      },
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return updateMatch(...args)
      }
    })

    t.field('updateBattle', {
      type: 'Battle',
      args: {
        id: nonNull(idArg()),
        character: idArg(),
        vote: idArg()
      },
      authorize: authorizations(isAuthenticated),
      resolve(...args) {
        return updateBattle(...args)
      }
    })
  }
})
