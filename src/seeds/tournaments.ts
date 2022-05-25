import { fromUnixTime, isBefore } from 'date-fns'
import { Tournament } from '../mongo'
import { prisma } from '../prisma'
import logger from '../utils/logger'
import {
  eligibility,
  fetchEvents,
  fetchTournaments,
  getAllConnectedUsersForTournament,
  tier
} from '../utils/tournament'

export async function loadTournaments() {
  logger.info('fetching tournaments')
  const tourneys = await fetchTournaments()
  const events = await fetchEvents(tourneys)

  logger.info('mapping events to tournaments')
  const tournaments = tourneys.map((tournament) => ({
    ...tournament,
    events: tournament.events.map((event) =>
      events.find((e) => e.id === event.id)
    )
  }))

  // Create all tournaments, upsert if needed
  const createTournaments = tournaments.map(async (tournament) => {
    const foundConnectedUsers = await getAllConnectedUsersForTournament(
      tournament
    )

    const tourney = {
      name: tournament.name,
      lat: tournament.lat,
      lng: tournament.lng,
      tournament_id: tournament.id,
      city: tournament.city,
      country_code: tournament.countryCode,
      created_at: tournament.createdAt
        ? fromUnixTime(tournament.createdAt)
        : null,
      currency: tournament.currency,
      num_attendees: tournament.numAttendees,
      end_at: tournament.endAt ? fromUnixTime(tournament.endAt) : null,
      event_registration_closes_at: tournament.eventRegistrationClosesAt
        ? fromUnixTime(tournament.eventRegistrationClosesAt)
        : null,
      images: tournament.images.map((image) => image.url),
      is_registration_open: tournament.isRegistrationOpen,
      slug: tournament.slug,
      state: tournament.state,
      venue_name: tournament.venueName,
      venue_address: tournament.venueAddress,
      start_at: tournament.startAt ? fromUnixTime(tournament.startAt) : null,
      url: tournament.url,
      events: {
        createMany: {
          data: tournament.events.map((event) => ({
            event_id: event.id,
            name: event.name,
            num_attendees: event.numEntrants || 0,
            tier: tier(event.numEntrants),
            valid: eligibility(event.name.toLowerCase())
          })),
          skipDuplicates: true
        }
      },
      participants: {
        connect: foundConnectedUsers
      }
    }

    const now = new Date()
    if (isBefore(tourney.end_at, now)) {
      logger.warn(
        `Tourney ${tourney.name} is outdated, not upserting. (${tourney.end_at})`
      )
      return null
    }

    // It's an online tournament, dont put it
    if (!tournament.hasOfflineEvents) {
      logger.warn(`Tourney ${tourney.name} is online, not upserting.`)
      return null
    }

    // Compute latitude longitude in mongo for geospatial queries later
    if (tournament.lat && tournament.lng) {
      await Tournament.create({
        ref: tournament.id,
        location: {
          type: 'Point',
          coordinates: [tournament.lng, tournament.lat]
        }
      })
    }

    return prisma.tournament.upsert({
      where: {
        tournament_id: tournament.id
      },
      create: tourney,
      update: tourney
    })
  })

  await Promise.all(createTournaments)
}
