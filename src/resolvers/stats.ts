import { Character, User } from '@prisma/client'
import { prisma } from '../prisma'
import { QueryArg } from '../typings/interfaces'

export const stats: QueryArg<'stats'> = async (_, args, { user }) => {
  const users = new Map<string, User>()
  const characters = new Map<string, Character>()
  const scoresByCharacters = new Map<string, { total: number; wins: number }>()
  const scoresByUsers = new Map<string, { total: number; wins: number }>()
  const scoresByMatches = { total: 0, wins: 0 }
  const scoresBySets = { total: 0, wins: 0 }

  const matches = await prisma.match.findMany({
    where: {
      OR: [
        {
          initiator_id: user.id
        },
        {
          opponent_id: user.id
        }
      ]
    },
    include: {
      battles: {
        include: {
          initiator: true,
          opponent: true,
          initiator_character: true,
          opponent_character: true,
          winner: true
        }
      },
      initiator: true,
      opponent: true,
      winner: true
    }
  })

  matches.forEach((match) => {
    const win = match.winner_id === user.id
    const isInitiator = match.initiator_id === user.id
    const opponent = isInitiator ? match.opponent : match.initiator

    users.set(opponent.id, opponent)
    scoresBySets.total = scoresBySets.total + 1
    scoresBySets.wins = win ? scoresBySets.wins + 1 : scoresBySets.wins

    match.battles.forEach((battle) => {
      // If user is initiator, add his character opponent
      const isInitiator = battle.initiator_id === user.id
      const win = battle.winner_id === user.id
      const character = isInitiator
        ? battle.opponent_character
        : battle.initiator_character
      const opponent = isInitiator ? battle.opponent : battle.initiator

      characters.set(character.id, character)
      scoresByMatches.total = scoresByMatches.total + 1
      scoresByMatches.wins = win
        ? scoresByMatches.wins + 1
        : scoresByMatches.wins

      if (scoresByUsers.has(opponent.id)) {
        const score = scoresByUsers.get(opponent.id)

        scoresByUsers.set(opponent.id, {
          total: score.total + 1,
          wins: win ? score.wins + 1 : score.wins
        })
      } else {
        scoresByUsers.set(opponent.id, {
          total: 1,
          wins: win ? 1 : 0
        })
      }

      if (scoresByCharacters.has(character.id)) {
        const score = scoresByCharacters.get(character.id)

        scoresByCharacters.set(character.id, {
          total: score.total + 1,
          wins: win ? score.wins + 1 : score.wins
        })
      } else {
        scoresByCharacters.set(character.id, {
          total: 1,
          wins: win ? 1 : 0
        })
      }
    })
  })

  const returnedUsers = []
  const returnedCharacters = []

  scoresByUsers.forEach((value, key) => {
    returnedUsers.push({
      user: users.get(key),
      stat: value
    })
  })

  scoresByCharacters.forEach((value, key) => {
    returnedCharacters.push({
      character: characters.get(key),
      stat: value
    })
  })

  return {
    sets: scoresBySets,
    matches: scoresByMatches,
    users: returnedUsers,
    characters: returnedCharacters
  }
}
