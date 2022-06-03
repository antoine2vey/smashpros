import { withFilter } from 'graphql-subscriptions'
import { idArg, nonNull, subscriptionType } from 'nexus'
import { pubsub } from '../redis'
import { PubSub } from '../typings/enums'

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

    t.field('onUserJoinMatch', {
      type: 'User',
      args: {
        id: nonNull(idArg())
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(PubSub.Actions.MATCH_JOIN),
        ({ user }, args) => {
          // Send event to only user's opponent
          return user.id === args.id
        }
      ),
      resolve({ user }) {
        return user
      }
    })

    t.field('onUserLeftMatch', {
      type: 'User',
      args: {
        id: nonNull(idArg())
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(PubSub.Actions.MATCH_LEFT),
        ({ user }, args) => {
          // Send event to only user's opponent
          return user.id === args.id
        }
      ),
      resolve({ user }) {
        return user
      }
    })

    t.field('onMatchUpdate', {
      type: 'Match',
      args: {
        id: nonNull(idArg())
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(PubSub.Actions.MATCH_UPDATE_STATE),
        ({ match }, args) => {
          // Update state for only people in this match
          return match.id === args.id
        }
      ),
      resolve({ match }) {
        return match
      }
    })

    t.field('onBattleUpdate', {
      type: 'Battle',
      args: {
        id: idArg()
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(PubSub.Actions.BATTLE_UPDATE_STATE),
        ({ battle }, args) => {
          // Update state for only people in this battle
          return battle.id === args.id
        }
      ),
      async resolve({ battle }) {
        return battle
      }
    })
  }
})
