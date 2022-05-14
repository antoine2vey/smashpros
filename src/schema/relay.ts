import { intArg, list, objectType, stringArg } from 'nexus'
import { NexusListableTypes, NexusObjectTypeDef } from 'nexus/dist/core'

export const relayArgs = {
  after: stringArg(),
  before: stringArg(),
  first: intArg(),
  last: intArg()
}

// Build PageInfo type
export const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.string('endCursor')
    t.string('startCursor')
    t.nonNull.boolean('hasNextPage')
    t.nonNull.boolean('hasPreviousPage')
  }
})

// Define edge by type, used to construct connections
export function defineEdge<T extends string>(
  name: string,
  type: NexusObjectTypeDef<T>
) {
  return objectType({
    name: `${name}Edge`,
    definition(t) {
      t.nonNull.string('cursor')
      t.field('node', { type })
    }
  })
}

// Define connections, must pass an edgeType (single object)
export function defineConnection(name: string, edgeType: NexusListableTypes) {
  return objectType({
    name: `${name}Connection`,
    definition(t) {
      t.nonNull.field('pageInfo', { type: PageInfo })
      t.nonNull.int('totalCount')
      t.field('edges', { type: list(edgeType) })
    }
  })
}
