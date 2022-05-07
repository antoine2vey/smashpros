import {
  connectionPlugin,
  inputObjectType,
  list,
  nonNull,
  objectType
} from 'nexus'
import { Event, Tournament, User } from 'nexus-prisma'
import { prisma } from '../prisma'
import {
  getCharacterQuery,
  getCursorForArgs,
  getCursorForStringArgs,
  getTournamentQuery
} from '../utils/prisma'

export const EventObjectType = objectType({
  name: Event.$name,
  description: Event.$description,
  definition: (t) => {
    t.field(Event.id)
    t.field(Event.event_id)
    t.field(Event.name)
    t.field(Event.num_attendees)
    t.field(Event.tier)
    t.field(Event.tournament)
    t.field(Event.valid)
  }
})

export const TournamentObjectType = objectType({
  name: Tournament.$name,
  description: Tournament.$description,
  definition: (t) => {
    t.field(Tournament.id)
    t.field(Tournament.tournament_id)
    t.field(Tournament.name)
    t.field(Tournament.city)
    t.field(Tournament.country_code)
    t.field(Tournament.created_at)
    t.field(Tournament.currency)
    t.field(Tournament.num_attendees)
    t.field(Tournament.end_at)
    t.field(Tournament.start_at)
    t.field(Tournament.is_started)
    t.field(Tournament.event_registration_closes_at)
    t.field(Tournament.has_offline_events)
    t.field(Tournament.images)
    t.field(Tournament.is_registration_open)
    t.field(Tournament.lat)
    t.field(Tournament.lng)
    t.field(Tournament.slug)
    t.field(Tournament.state)
    t.field(Tournament.venue_name)
    t.field(Tournament.venue_address)
    t.field(Tournament.favorited_by)
    t.field(Tournament.events)

    t.connectionField(Tournament.participants.name, {
      type: User.$name,
      description: Tournament.participants.description,
      additionalArgs: {
        characters: list(nonNull('ID'))
      },
      cursorFromNode(node) {
        return connectionPlugin.base64Encode(node.id.toString())
      },
      extendConnection(t) {
        t.int('totalCount', {
          async resolve(root, args, ctx) {
            return prisma.user.count({
              where: {
                tournaments: {
                  // @ts-ignore
                  some: { id: root.id }
                }
              }
            })
          }
        })
      },
      nodes(root, { characters, ...args }) {
        const cursor = getCursorForStringArgs('id', args)

        return prisma.user.findMany({
          ...cursor,
          where: {
            AND: [
              {
                characters: getCharacterQuery(characters)
              },
              {
                tournaments: getTournamentQuery(root.id)
              },
              {
                allow_searchability: true
              }
            ]
          },
          include: {
            characters: true
          },
          orderBy: [
            {
              tag: 'asc'
            },
            {
              id: 'asc'
            }
          ]
        })
      }
    })
  }
})

export const TournamentQuery = inputObjectType({
  name: 'TournamentQuery',
  definition(t) {
    t.id('id')
    t.string('player')
  }
})
