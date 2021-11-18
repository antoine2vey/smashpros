import { Match, MatchState, User } from ".prisma/client"
import { UserInputError } from "apollo-server-errors"
import { prisma } from "../prisma"
import { MutationArg, QueryArg } from "../typings/interfaces"

function matchGuard(match: Match, user: User) {
  const isInitiator = match.initiator_id === user.id
  const isAdversary = match.adversary_id === user.id

  if (!isInitiator && !isAdversary) {
    return new UserInputError('Not user\'s match')
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

export const matches: QueryArg<"matches"> = async (_, args, { user }, info) => {
  // Find all matches where user is either initiator or adversary
  return prisma.match.findMany({
    where: {
      OR: [
        {
          adversary: {
            id: user.id
          }
        },
        {
          initiator: {
            id: user.id
          }
        }
      ]
    }
  })
}

export const sendMatchInvite: MutationArg<"sendMatchInvite"> = async (_, args, { user }, info) => {
  const { amount, isMoneymatch, totalMatches, to } = args

  // Best of matches are odd numbers: 1, 3, 5, 7, 9 ...
  if (totalMatches % 2 === 0) {
    throw new UserInputError("Number of total matche has to be odd")
  }

  // If it is a moneymatch, you need to actually provide an amount
  if (isMoneymatch && (!amount || amount <= 0)) {
    throw new UserInputError("Amount has to exist or be superior to zero if it's a moneymatch")
  }
  
  return prisma.match.create({
    data: {
      total_matches: totalMatches,
      adversary: { connect: { id: to }},
      initiator: { connect: { id: user.id }},
      amount: amount || 0,
      is_moneymatch: isMoneymatch || false
    }
  })
}

export const updateMatchState: MutationArg<"updateMatchState"> = async (_, args, { user }, info) => {
  const { state, id } = args
  const match = await prisma.match.findUnique({ where: { id } })
  const matchGuardError = matchGuard(match, user)

  if (matchGuardError) {
    throw matchGuardError
  }

  // You can only start or refuse a match manually, others action are either automatic/malicious
  if (
    state !== MatchState.STARTED &&
    state !== MatchState.REFUSED
  ) {
    throw new UserInputError("You can only start of refuse a match manually")
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

export const updateMatchScore: MutationArg<"updateMatchScore"> = async (_, args, { user }, info) => {
  const { id, adversaryCharacter, initiatorCharacter } = args
  const match = await prisma.match.findUnique({ where: { id } })
  const isInitiator = match.initiator_id === user.id
  const isAdversary = match.adversary_id === user.id
  const matchGuardError = matchGuard(match, user)

  if (matchGuardError) {
    throw matchGuardError
  }

  if (match.state !== MatchState.STARTED) {
    throw new UserInputError('Match has to start first to update it')
  }
  
  // Determine if any player has reached required number of wins needed
  const initiatorWin = bestOfWinner(match.total_matches, match.intiator_wins + 1)
  const adversaryWin = bestOfWinner(match.total_matches, match.adversary_wins + 1)
  // If so, set the state to finished
  const computedMatchState = (initiatorWin || adversaryWin) ? MatchState.FINISHED : match.state

  return prisma.match.update({
    where: {
      id
    },
    data: {
      intiator_wins: {
        increment: isInitiator ? 1 : 0
      },
      adversary_wins: {
        increment: isAdversary ? 1 : 0
      },
      state: computedMatchState,
      battles: {
        create: {
          adversary: { connect: { id: match.adversary_id }},
          initiator: { connect: { id: match.initiator_id }},
          adversary_character: { connect: { id: adversaryCharacter }},
          initiator_character: { connect: { id: initiatorCharacter }},
          winner: {
            connect: {
              id: (initiatorWin ? match.initiator_id : match.adversary_id)
            }
          }
        }
      }
    }
  })
}
