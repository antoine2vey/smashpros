import { connectionPlugin, inputObjectType, list, nonNull, objectType } from "nexus"
import { Event, Tournament, User } from 'nexus-prisma'

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
      edgeFields: false,
      description: Tournament.participants.description,
      additionalArgs: {
        characters: list(nonNull('ID'))
      },
      cursorFromNode(node) {
        return connectionPlugin.base64Encode(node.smashgg_player_id.toString())
      },
      nodes(root, args) {
        //@ts-ignore
        const { participants } = root

        // If no args, send root participants
        if (!args.characters) {
          return participants
        }

        // Else, apply filter on every player, find them for characters
        return participants
          // Find all players by character
          .filter(player => (
            player.characters.some(character => (
              args.characters.includes(character.id)
            ))
          ))
      }
    })
  }
})

export const TournamentQuery = inputObjectType({
  name: 'TournamentQuery',
  definition(t) {
    t.id('id')
    t.string('player')
  },
})