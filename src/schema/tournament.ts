import { isEmpty } from "lodash"
import { inputObjectType, list, nonNull, objectType, stringArg } from "nexus"
import { Tournament, User } from 'nexus-prisma'
import { Context } from "../context"

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
    // t.field(Tournament.images)
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
        query: TournamentQuery
      },
      async resolve(tournament, { query }) {
        //... logic
        if (isEmpty(query)) {
          // Return all participants if no filter
          return tournament.participants
        }
      
        const { id, player } = query
        return tournament.participants.filter(participant => {
          if (id) {
            return participant.characters.some(char => char.id === id)
          }
      
          if (player) {
            return participant.tag.includes(player)
          }
      
          return true
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
  },
})