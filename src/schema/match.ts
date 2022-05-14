import { MatchState } from '@prisma/client'
import { enumType, objectType } from 'nexus'
import { Battle, Match } from 'nexus-prisma'
import { defineConnection, defineEdge } from './relay'

export const BattleObjectType = objectType({
  name: Battle.$name,
  description: Battle.$description,
  definition: (t) => {
    t.field(Battle.id)
    t.field(Battle.initiator)
    t.field(Battle.initiator_character)
    t.field(Battle.initiator_vote)
    t.field(Battle.opponent)
    t.field(Battle.opponent_character)
    t.field(Battle.opponent_vote)
    t.field(Battle.winner)
    t.field(Battle.winner_id)
  }
})

export const MatchObjectType = objectType({
  name: Match.$name,
  description: Match.$description,
  definition: (t) => {
    t.field(Match.id)
    t.field(Match.opponent)
    t.field(Match.initiator)
    t.field(Match.amount)
    t.field(Match.total_matches)
    t.field(Match.is_moneymatch)
    t.field(Match.initiator_wins)
    t.field(Match.opponent_wins)
    t.field(Match.state)
    t.field(Match.battles)
    t.field(Match.winner)
    t.field(Match.winner_id)
  }
})

export const MatchStateEnumType = enumType({
  name: 'MatchState',
  members: MatchState
})

export const MatchEdge = defineEdge<'Match'>('Match', MatchObjectType)
export const MatchConnection = defineConnection('Match', 'MatchEdge')
