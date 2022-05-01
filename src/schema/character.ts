import { objectType } from 'nexus'
import { Character } from 'nexus-prisma'

export const CharacterObjectType = objectType({
  name: Character.$name,
  description: Character.$description,
  definition: (t) => {
    t.field(Character.id)
    t.field(Character.name)
    t.field(Character.picture)
    t.field(Character.users)
  }
})
