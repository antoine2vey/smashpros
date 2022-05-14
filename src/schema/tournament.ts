import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { Prisma } from '@prisma/client'
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
import { defineConnection, defineEdge, relayArgs } from './relay'

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

    t.field(Tournament.participants.name, {
      type: 'UserConnection',
      description: Tournament.participants.description,
      args: {
        ...relayArgs,
        characters: list(nonNull('ID'))
      },
      resolve(root, { characters, ...args }) {
        const baseArgs: Prisma.UserFindManyArgs = {
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
        }

        return findManyCursorConnection(
          (args) =>
            prisma.user.findMany({
              ...args,
              ...baseArgs
            }),
          () => prisma.user.count({ where: baseArgs.where }),
          args
        )
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

export const TournamentEdge = defineEdge<'Tournament'>(
  'Tournament',
  TournamentObjectType
)
export const TournamentConnection = defineConnection(
  'Tournament',
  'TournamentEdge'
)
