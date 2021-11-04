import { nonNull, subscriptionType } from "nexus";
import { pubsub } from "../redis";
import { PubSub } from "../typings/enums";

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
    }),
    t.field('userLeftTournament', {
      type: nonNull('User'),
      subscribe() {
        return pubsub.asyncIterator(PubSub.Actions.USER_LEFT_TOURNAMENT)
      },
      resolve({ user }) {
        return user
      }
    })
  }
})