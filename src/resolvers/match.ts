import { Match, MatchState, User } from '.prisma/client'
import { UserInputError } from 'apollo-server-errors'
import { prisma } from '../prisma'
import { MutationArg, QueryArg } from '../typings/interfaces'
import { sendNotification } from '../utils/notifications'
import { getCursorForArgs } from '../utils/prisma'

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
    },
    include: {
      opponent: true,
      initiator: true
    }
  })
}

export const matches: QueryArg<'matches'> = async (_, args, { user }, info) => {
  const cursor = getCursorForArgs('id', args)
  // Find all matches where user is either initiator or opponent
  return prisma.match.findMany({
    ...cursor,
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
    include: {
      opponent: true,
      initiator: true
    }
  })
}

export const sendMatchInvite: MutationArg<'sendMatchInvite'> = async (
  _,
  args,
  { user },
  info
) => {
  const { amount, isMoneymatch, totalMatches, to } = args

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

export const updateMatchState: MutationArg<'updateMatchState'> = async (
  _,
  args,
  { user },
  info
) => {
  const { state, id } = args
  const match = await prisma.match.findUnique({ where: { id } })
  const matchGuardError = matchGuard(match, user)

  if (matchGuardError) {
    throw matchGuardError
  }

  // You can only start or refuse a match manually, others action are either automatic/malicious
  if (state !== MatchState.STARTED && state !== MatchState.REFUSED) {
    throw new UserInputError('You can only start of refuse a match manually')
  }

  return prisma.match.update({
    where: {
      id
    },
    data: {
      state
    }
  })
}

export const updateMatchScore: MutationArg<'updateMatchScore'> = async (
  _,
  args,
  { user },
  info
) => {
  const { id, opponentCharacter, initiatorCharacter } = args
  const match = await prisma.match.findUnique({ where: { id } })
  const isInitiator = match.initiator_id === user.id
  const isOpponent = match.opponent_id === user.id
  const matchGuardError = matchGuard(match, user)

  if (matchGuardError) {
    throw matchGuardError
  }

  if (match.state !== MatchState.STARTED) {
    throw new UserInputError('Match has to start first to update it')
  }

  // Determine if any player has reached required number of wins needed
  const initiatorWin = bestOfWinner(
    match.total_matches,
    match.initiator_wins + 1
  )
  const opponentWin = bestOfWinner(
    match.total_matches,
    match.opponent_wins + 1
  )
  // If so, set the state to finished
  const computedMatchState =
    initiatorWin || opponentWin ? MatchState.FINISHED : match.state

  return prisma.match.update({
    where: {
      id
    },
    data: {
      initiator_wins: {
        increment: isInitiator ? 1 : 0
      },
      opponent_wins: {
        increment: isOpponent ? 1 : 0
      },
      state: computedMatchState,
      battles: {
        create: {
          opponent: { connect: { id: match.opponent_id } },
          initiator: { connect: { id: match.initiator_id } },
          opponent_character: { connect: { id: opponentCharacter } },
          initiator_character: { connect: { id: initiatorCharacter } },
          winner: {
            connect: {
              id: user.id
            }
          }
        }
      }
    }
  })
}
