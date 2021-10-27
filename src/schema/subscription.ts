import { User } from "@prisma/client";
import { nonNull, subscriptionType } from "nexus";
import { pubsub } from "../redis";
import { PubSubActions } from "../typings/enums";

export const Subscription = subscriptionType({
  definition(t) {
    t.field('userEnteredTournament', {
      type: nonNull('User'),
      subscribe() {
        return pubsub.asyncIterator(PubSubActions.USER_ENTERED_TOURNAMENT)
      },
      resolve({ userEnteredTournament }) {
        return userEnteredTournament
      }
    })
  }
})