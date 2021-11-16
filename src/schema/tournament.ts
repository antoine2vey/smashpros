import { inputObjectType, list, nonNull, objectType } from "nexus"
import { Tournament } from 'nexus-prisma'

export const TournamentObjectType = objectType({
  name: Tournament.$name,
  description: Tournament.$description,
  definition: (t) => {
    t.field(Tournament.id)
    t.field(Tournament.tournament_id)
    t.field(Tournament.name)
    t.field(Tournament.city)
    t.field(Tournament.countryCode)
    t.field(Tournament.createdAt)
    t.field(Tournament.currency)
    t.field(Tournament.numAttendees)
    t.field(Tournament.endAt)
    t.field(Tournament.eventRegistrationClosesAt)
    t.field(Tournament.hasOfflineEvents)
    t.field(Tournament.images)
    t.field(Tournament.isRegistrationOpen)
    t.field(Tournament.lat)
    t.field(Tournament.lng)
    t.field(Tournament.slug)
    t.field(Tournament.state)
    t.field(Tournament.venueName)
    t.field(Tournament.venueAddress)
    t.field(Tournament.favorited_by)
    t.field(Tournament.participants.name, {
      type: Tournament.participants.type,
      description: Tournament.participants.description,
      args: {
        characters: list(nonNull('ID'))
      },
      resolve: async (root, args) => {
        // @ts-ignore idkkkk :(
        const { participants } = root

        // If no args, send root participants
        if (!args.characters) {
          return participants
        }

        // Else, apply filter on every player, find them for characters
        return participants.filter(player => (
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