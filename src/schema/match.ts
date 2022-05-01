import { MatchState } from '.prisma/client'
import { enumType, objectType } from 'nexus'
import { Battle, Match } from 'nexus-prisma'

export const BattleObjectType = objectType({
  name: Battle.$name,
  description: Battle.$description,
  definition: (t) => {
    t.field(Battle.id)
    t.field(Battle.adversary)
    t.field(Battle.initiator)
    t.field(Battle.initiator_character)
    t.field(Battle.adversary_character)
    t.field(Battle.winner)
  }
})

export const MatchObjectType = objectType({
  name: Match.$name,
  description: Match.$description,
  definition: (t) => {
    t.field(Match.id)
    t.field(Match.adversary)
    t.field(Match.initiator)
    t.field(Match.amount)
    t.field(Match.total_matches)
    t.field(Match.is_moneymatch)
    t.field(Match.intiator_wins)
    t.field(Match.adversary_wins)
    t.field(Match.state)
    t.field(Match.battles)
  }
})

export const MatchStateEnumType = enumType({
  name: 'MatchState',
  members: MatchState
})
