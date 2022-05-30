import { fromUnixTime, isBefore } from 'date-fns'
import { gql } from 'graphql-request'
import _ from 'lodash'
import { Tournament } from '../mongo'
import { prisma } from '../prisma'
import smashGGClient from '../smashGGClient'
import { IEvent, ITournament, SmashGG } from '../typings/interfaces'
import logger from './logger'

export function tier(players: number) {
  if (players >= 128) {
    return 'S'
  }

  if (players >= 96) {
    return 'A'
  }

  if (players >= 64) {
    return 'B'
  }

  return 'C'
}

export function eligibility(name: string) {
  if (
    name.includes('attente') ||
    name.includes('liste') ||
    name.includes('spectateur') ||
    name.includes('side') ||
    name.includes('amateur') ||
    name.includes('freeplay')
  ) {
    return false
  }

  return true
}

const wait = (seconds: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), seconds * 1000))

async function fetchAllEventParticipant(
  id: number,
  page = 1,
  event: IEvent = null
): Promise<IEvent> {
  const query = gql`
    query TournamentQuery($id: ID!, $page: Int!) {
      event(id: $id) {
        id
        name
        numEntrants
        entrants(query: { page: $page, perPage: 250 }) {
          pageInfo {
            page
            totalPages
          }
          nodes {
            participants {
              player {
                id
              }
            }
          }
        }
      }
    }
  `
  const data = await smashGGClient.request<SmashGG.Event, SmashGG.EventArgs>(
    query,
    { page, id }
  )
  const { nodes, pageInfo } = data.event.entrants

  // Set our accumulator
  event = {
    ...data.event,
    entrants: {
      ...data.event.entrants,
      nodes: [
        // If event is null, default to array
        ...(event?.entrants.nodes ?? []),
        ...nodes
      ]
    }
  }

  logger.info(`event:${event.id} - fetching participants (page: ${page})`)

  // If we reached the end or no pages, return event
  if (pageInfo.page === pageInfo.totalPages || pageInfo.totalPages === 0) {
    logger.info(
      `event:${event.id} - fetched all participants (${event.entrants.nodes.length})`
    )
    return event
  } else {
    // Else we recursively fetch all tournaments
    await wait(1)
    return await fetchAllEventParticipant(id, pageInfo.page + 1, event)
  }
}

async function fetchEvents(tournaments: ITournament[]) {
  const events: IEvent[] = []

  logger.info('fetching events...')
  for (let tournament of tournaments) {
    for (let event of tournament.events) {
      await wait(1)
      const fullEvent = await fetchAllEventParticipant(event.id)
      events.push(fullEvent)
    }
  }

  return events
}

async function fetchTournaments(
  accumulator: ITournament[] = [],
  page = 1
): Promise<ITournament[]> {
  const query = gql`
    query TournamentQuery($page: Int!) {
      tournaments(
        query: {
          filter: { videogameIds: [1386], upcoming: true, countryCode: "FR" }
          sortBy: "startAt asc"
          page: $page
        }
      ) {
        pageInfo {
          totalPages
          page
        }
        nodes {
          id
          name
          city
          countryCode
          createdAt
          currency
          numAttendees
          startAt
          endAt
          eventRegistrationClosesAt
          hasOfflineEvents
          hashtag
          images {
            id
            url
          }
          isRegistrationOpen
          lat
          lng
          slug
          state
          venueName
          venueAddress
          url(relative: false)
          name
          events(filter: { videogameId: 1386, type: 1 }) {
            name
            id
          }
        }
      }
    }
  `
  const data = await smashGGClient.request<
    SmashGG.Tournament,
    SmashGG.TournamentArgs
  >(query, { page })
  const { nodes, pageInfo } = data.tournaments

  // Add it to accumulator
  accumulator.push(...nodes)
  logger.info(`tournaments - fetched (page: ${page})`)

  // If we reached the end, exit
  if (pageInfo.page === pageInfo.totalPages) {
    logger.info(`tournaments - fetched all tournaments (${accumulator.length})`)
    return accumulator
  } else {
    // Else we recursively fetch all tournaments
    return await fetchTournaments(accumulator, pageInfo.page + 1)
  }
}

async function getAllConnectedUsersForTournament(tournament: ITournament) {
  // Map users by their id
  const participants = tournament.events
    .map((e) =>
      e.entrants.nodes.map((t) => {
        if (t.participants.length === 0) {
          logger.error(
            `Error in mapping entrants (event: ${e.id}): ${JSON.stringify(t)}`
          )
          return -1
        } else {
          return t.participants[0].player.id
        }
      })
    )
    .flat()
  // Filter out duplicates
  const uniqueParticipants = _.uniq(participants)
  // Get all users by their SmashGG player id
  const users = await prisma.user.findMany({
    where: {
      smashgg_player_id: {
        in: uniqueParticipants
      }
    }
  })

  return users.map((user) => ({ smashgg_player_id: user.smashgg_player_id }))
}

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
