import { idArg, nonNull, subscriptionType } from 'nexus'
import { pubsub } from '../redis'
import { PubSub } from '../typings/enums'
import { MatchStateEnumType } from './match'

export const Subscription = subscriptionType({
  definition(t) {
    t.field('userEnteredTournament', {
      type: nonNull('User'),
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.USER_ENTERED_TOURNAMENT)
      },
      resolve({ user }) {
        return user
      }
    })

    t.field('userLeftTournament', {
      type: nonNull('User'),
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.USER_LEFT_TOURNAMENT)
      },
      resolve({ user }) {
        return user
      }
    })

    t.field('userJoinMatch', {
      type: 'User',
      args: {
        id: nonNull(idArg())
      },
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.MATCH_JOIN)
      },
      resolve() {
        return null
      }
    })

    t.field('userLeftMatch', {
      type: 'User',
      args: {
        id: nonNull(idArg())
      },
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.MATCH_LEFT)
      },
      resolve() {
        return null
      }
    })

    t.field('matchUpdateState', {
      type: 'Match',
      args: {
        id: nonNull(idArg()),
        state: nonNull(MatchStateEnumType)
      },
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.MATCH_UPDATE_STATE)
      },
      resolve() {
        return null
      }
    })

    t.field('battleOpponentPick', {
      type: 'Battle',
      args: {
        id: nonNull(idArg()),
        characterId: nonNull(idArg())
      },
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.MATCH_OPPONENT_PICK)
      },
      resolve() {
        return null
      }
    })

    t.field('battleInitiatorPick', {
      type: 'Battle',
      args: {
        id: nonNull(idArg()),
        characterId: nonNull(idArg())
      },
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.MATCH_INITIATOR_PICK)
      },
      resolve() {
        return null
      }
    })

    t.field('battleStagePick', {
      type: 'Battle',
      args: {
        id: nonNull(idArg()),
        stageId: nonNull(idArg())
      },
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.MATCH_STAGE_PICK)
      },
      resolve() {
        return null
      }
    })
    
    t.field('battleStageBan', {
      type: 'Battle',
      args: {
        id: nonNull(idArg()),
        stageId: nonNull(idArg())
      },
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.MATCH_STAGE_BAN)
      },
      resolve() {
        return null
      }
    })
  }
})
