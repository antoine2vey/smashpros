import { list, objectType } from 'nexus'
import { CharacterObjectType } from './character'
import { UserObjectType } from './user'

const StatObjectType = objectType({
  name: 'Stat',
  definition: (t) => {
    t.int('wins')
    t.int('total')
  }
})

const CharacterStat = objectType({
  name: 'CharacterStat',
  definition: (t) => {
    t.field('character', { type: CharacterObjectType })
    t.field('stat', { type: StatObjectType })
  }
})

const UserStat = objectType({
  name: 'UserStat',
  definition: (t) => {
    t.field('user', { type: UserObjectType })
    t.field('stat', { type: StatObjectType })
  }
})

export const StatsObjectType = objectType({
  name: 'Stats',
  definition: (t) => {
    t.field('matches', { type: StatObjectType })
    t.field('sets', { type: StatObjectType })
    t.field('characters', { type: list(CharacterStat) })
    t.field('users', { type: list(UserStat) })
  }
})
