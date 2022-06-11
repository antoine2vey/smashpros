import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { BattleState, Match, MatchState, Prisma, User } from '@prisma/client'
import { UserInputError } from 'apollo-server-errors'
import { Battle } from 'nexus-prisma/index'
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

function battleGuard(battle: Battle, character: string, vote: string) {
  // Battle is over, can't update
  if (battle.state === BattleState.FINISHED) {
    return new UserInputError('Battle not updateable anymore')
  }

  // If user chooses character but battle isn't in appropriated state
  if (battle.state !== BattleState.CHARACTER_CHOICE && character) {
    return new UserInputError(
      `You cannot choose your character yet (current state is ${battle.state})`
    )
  }

  // If user votes but battle isn't in appropriated state
  if (battle.state !== BattleState.VOTING && vote) {
    return new UserInputError(
      `You cannot vote yet (current state is ${battle.state})`
    )
  }

  // If battle has a winner, throw error
  if (battle.winner_id) {
    throw new UserInputError(
      'You cannot update this battle since it has a winner'
    )
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
  if (state === MatchState.STARTED) {
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
  { id, character, vote, state },
  { user }
) => {
  const battle = await prisma.battle.findUnique({
    where: { id },
    include: { match: true }
  })
  const match = battle.match
  const isInitiator = user.id === battle.initiator_id
  const matchGuardError = matchGuard(battle.match, user)
  const battleGuardError = battleGuard(battle, character, vote)
  // If we have a winner (2 votes are the same), return his id, else undefined
  const winner = getBattleWinner(battle, vote, isInitiator)

  if (matchGuardError) {
    throw matchGuardError
  }

  if (battleGuardError) {
    throw battleGuardError
  }

  // Cannot pass character AND vote
  if (character && vote) {
    throw new UserInputError(
      'You can either pass vote or character, but not both'
    )
  }

  // If user tries to stop when it is already stopped
  if (battle.state === BattleState.VOTING && state === BattleState.VOTING) {
    throw new UserInputError('You cannot stop a battle that already is stopped')
  }

  // This case should never reach
  // Means that an user updated battle, but has no data inside
  if (
    !battle.initiator_character_id &&
    !battle.opponent_character_id &&
    !battle.opponent_vote_id &&
    !battle.initiator_vote_id &&
    winner
  ) {
    throw new UserInputError('Should never reach, some data is missing')
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

  let matchState: MatchState = undefined

  // If either initiator or opponent wins, update match state
  // to end match
  if (initiatorWin || opponentWin) {
    matchState = MatchState.FINISHED
  }

  // Users came to an agreement, then the battle is finished
  if (winner) {
    state = BattleState.FINISHED
  }

  const updatedBattle = await prisma.battle.update({
    where: {
      id
    },
    data: {
      state: state,
      // If user selected a character, set it
      ...getBattleCharacterQuery(character, isInitiator),
      // If user voted, set it
      ...getVoteQuery(vote, isInitiator),
      // If we have a winner, connect it
      winner: winner ? { connect: { id: winner } } : undefined,
      // If user starts battle, set start_at
      start_at: state === BattleState.PLAYING ? new Date() : undefined,
      // If user stops battle, set end_at
      end_at: state === BattleState.VOTING ? new Date() : undefined,
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
