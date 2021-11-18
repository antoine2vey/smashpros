import { MatchState } from ".prisma/client"
import { enumType, objectType } from "nexus"
import { Match } from 'nexus-prisma'

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
  }
})

export const MatchStateEnumType = enumType({
  name: 'MatchState',
  members: MatchState
})