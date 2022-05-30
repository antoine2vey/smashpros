import { objectType } from 'nexus'
import { Character } from 'nexus-prisma'

export const ZoneObjectType = objectType({
  name: 'Zone',
  description: Character.$description,
  definition: (t) => {
    t.string('id')
    t.string('name')
    t.string('picture')
    t.string('country_code')
  }
})
