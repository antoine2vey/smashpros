import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { Match, MatchState, Prisma, User } from '@prisma/client'
import { UserInputError } from 'apollo-server-errors'
import { prisma } from '../prisma'
import { pubsub } from '../redis'
import { PubSub } from '../typings/enums'
import { MutationArg, QueryArg } from '../typings/interfaces'
import { sendNotification } from '../utils/notifications'
import {
  getBattleCharacterQuery,
  getBattleWinner,
  getVoteQuery
} from '../utils/prisma'

function matchGuard(match: Match, user: User) {
  const isInitiator = match.initiator_id === user.id
  const isOpponent = match.opponent_id === user.id

  if (!isInitiator && !isOpponent) {
    return new UserInputError("Not user's match")
  }

  if (
    match.state === MatchState.REFUSED ||
    match.state === MatchState.FINISHED
  ) {
    return new UserInputError('This match is not updateable anymore')
  }
}

function bestOfWinner(totalMatches: number, wins: number) {
  return (totalMatches % wins) + wins === totalMatches
}

export const match: QueryArg<'match'> = async (_, { id }, { user }) => {
  return prisma.match.findUnique({
    where: {
      id
    }
  })
}

export const matches: QueryArg<'matches'> = async (_, args, { user }, info) => {
  const baseArgs: Prisma.MatchFindManyArgs = {
    where: {
      OR: [
        {
          opponent: {
            id: user.id
          }
        },
        {
          initiator: {
            id: user.id
          }
        }
      ]
    },
    orderBy: {
      created_at: 'asc'
    }
  }
  // Find all matches where user is either initiator or opponent
  return findManyCursorConnection(
    (args) =>
      prisma.match.findMany({
        ...args,
        ...baseArgs
      }),
    () => prisma.match.count({ where: baseArgs.where }),
    args
  )
}

export const sendMatchInvite: MutationArg<'sendMatchInvite'> = async (
  _,
  args,
  { user },
  info
) => {
  const { amount, isMoneymatch, totalMatches, to, tournament } = args

  // Best of matches are odd numbers: 1, 3, 5, 7, 9 ...
  if (totalMatches % 2 === 0) {
    throw new UserInputError('Number of total matche has to be odd')
  }

  // If it is a moneymatch, you need to actually provide an amount
  if (isMoneymatch && (!amount || amount <= 0)) {
    throw new UserInputError(
      "Amount has to exist or be superior to zero if it's a moneymatch"
    )
  }

  const opponent = await prisma.user.findUnique({ where: { id: to } })
  const match = await prisma.match.create({
    data: {
      total_matches: totalMatches,
      opponent: { connect: { id: opponent.id } },
      initiator: { connect: { id: user.id } },
      amount: amount || 0,
      tournament: tournament ? { connect: { id: tournament } } : undefined,
      is_moneymatch: isMoneymatch || false
    }
  })

  if (opponent.notification_token && opponent.allow_notifications) {
    // Send notification to user
    await sendNotification(opponent.notification_token, {
      notification: {
        title: `${user.tag} invited you to a match!`,
        body: `Click and game on 🎮`
      },
      data: {
        matchId: match.id
      }
    })
  }

  return match
}

export const updateMatch: MutationArg<'updateMatch'> = async (
  _,
  { state, id },
  { user },
  info
) => {
  const match = await prisma.match.findUnique({ where: { id } })
  const matchGuardError = matchGuard(match, user)

  if (matchGuardError) {
    throw matchGuardError
  }

  // If we choose a character, that means we have to create another battle
  if (state === MatchState.CHARACTER_CHOICE) {
    const update = await prisma.match.update({
      where: {
        id
      },
      data: {
        state,
        battles: {
          create: {
            opponent: { connect: { id: match.opponent_id } },
            initiator: { connect: { id: match.initiator_id } }
          }
        }
      }
    })

    pubsub.publish(PubSub.Actions.MATCH_UPDATE_STATE, { match: update })
    return update
  }

  const update = await prisma.match.update({
    where: {
      id
    },
    data: {
      state
    }
  })

  pubsub.publish(PubSub.Actions.MATCH_UPDATE_STATE, { match: update })
  return update
}

export const updateBattle: MutationArg<'updateBattle'> = async (
  _,
  { id, character, vote },
  { user }
) => {
  const battle = await prisma.battle.findUnique({
    where: { id },
    include: { match: true }
  })
  const match = battle.match
  const isInitiator = user.id === battle.initiator_id
  const matchGuardError = matchGuard(battle.match, user)
  // If we have a winner (2 votes are the same), return his id, else undefined
  const winner = getBattleWinner(battle, vote, isInitiator)

  if (matchGuardError) {
    throw matchGuardError
  }

  // Cannot pass character AND vote
  if (character && vote) {
    throw new UserInputError(
      'You can either pass vote or character, but not both'
    )
  }

  // If battle has a winner, throw error
  if (battle.winner_id) {
    throw new UserInputError(
      'You cannot update this battle since it has a winner'
    )
  }

  // If both user voted for a winner, evaluate if they won the match
  const initiatorWin = bestOfWinner(
    match.total_matches,
    match.initiator_wins + (winner === battle.initiator_id ? 1 : 0)
  )
  const opponentWin = bestOfWinner(
    match.total_matches,
    match.opponent_wins + (winner === battle.opponent_id ? 1 : 0)
  )

  /**
   * If users voted for their characters, return MatchState.PLAYING
   * Else
   *  If one of the two users won match, return MatchState.FINISHED
   *  Else
   *    If we have a battle winner, return MatchState.CHARACTER_CHOICE,
   *    Else return the default match state
   * @returns MatchState
   */
  const computedMatchState = () => {
    if (character) {
      if (isInitiator && battle.opponent_character_id) {
        return MatchState.PLAYING
      }

      if (!isInitiator && battle.initiator_character_id) {
        return MatchState.PLAYING
      }
    }

    return initiatorWin || opponentWin
      ? MatchState.FINISHED
      : winner
      ? MatchState.CHARACTER_CHOICE
      : match.state
  }

  const matchState = computedMatchState()
  const updatedBattle = await prisma.battle.update({
    where: {
      id
    },
    data: {
      ...getBattleCharacterQuery(character, isInitiator),
      ...getVoteQuery(vote, isInitiator),
      winner: winner ? { connect: { id: winner } } : undefined,
      match: winner
        ? {
            update: {
              state: matchState,
              initiator_wins: {
                increment: winner === battle.initiator_id ? 1 : 0
              },
              opponent_wins: {
                increment: winner === battle.opponent_id ? 1 : 0
              },
              winner:
                matchState === MatchState.FINISHED
                  ? { connect: { id: winner } }
                  : undefined
            }
          }
        : undefined
    },
    include: {
      // Include match only if someone won it
      match: matchState === MatchState.FINISHED
    }
  })

  // If we have a winnner, we send an update with match + a new battle
  if (winner && matchState !== MatchState.FINISHED) {
    const updatedMatch = await prisma.match.update({
      where: {
        id: match.id
      },
      data: {
        battles: {
          create: {
            opponent: { connect: { id: match.opponent_id } },
            initiator: { connect: { id: match.initiator_id } }
          }
        }
      }
    })

    pubsub.publish(PubSub.Actions.MATCH_UPDATE_STATE, { match: updatedMatch })
  }

  // If an user has won the match, send the updated match to end
  if (matchState === MatchState.FINISHED) {
    pubsub.publish(PubSub.Actions.MATCH_UPDATE_STATE, {
      match: updatedBattle.match
    })
  }

  pubsub.publish(PubSub.Actions.BATTLE_UPDATE_STATE, { battle: updatedBattle })
  return updatedBattle
}
