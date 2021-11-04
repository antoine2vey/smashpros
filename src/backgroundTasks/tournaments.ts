import { endOfDay, fromUnixTime, isBefore, startOfDay } from 'date-fns'
import { gql } from 'graphql-request'
import fetch from 'node-fetch'
import { prisma } from '../prisma'
import smashGGClient from '../smashGGClient'
import { SmashGG } from '../typings/interfaces'
import logger from '../utils/logger'

function setTournamentsStart() {
  const now = new Date()

  return prisma.tournament.updateMany({
    where: {
      startAt: {
        gte: startOfDay(now),
        lte: endOfDay(now)
      }
    },
    data: {
      is_started: true
    }
  })
}

function cleanOutdatedTournaments() {
  return prisma.tournament.deleteMany({
    where: {
      endAt: {
        lte: new Date()
      }
    }
  })
}

async function loadTournaments() {
  const query = gql`
    query {
      tournaments(query: {
        filter: {
          countryCode: "FR"
          videogameIds: [1386]
          upcoming: true
        }
        sortBy: "startAt asc",
        perPage: 500
      }) {
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
        }
      }
    }
  `

  const data = await smashGGClient.request<SmashGG.Tournament>(query)
  const tournaments = data.tournaments.nodes
      
  // Create all tournaments, upsert if needed
  const createTournaments = tournaments.map(tournament => {
    const now = new Date()
    const tourney = {
      name: tournament.name,
      lat: tournament.lat,
      lng: tournament.lng,
      tournament_id: tournament.id,
      city: tournament.city,
      countryCode: tournament.countryCode,
      createdAt: tournament.createdAt ? fromUnixTime(tournament.createdAt) : null,
      currency: tournament.currency,
      numAttendees: tournament.numAttendees,
      endAt: tournament.endAt ? fromUnixTime(tournament.endAt) : null,
      eventRegistrationClosesAt: tournament.eventRegistrationClosesAt ? fromUnixTime(tournament.eventRegistrationClosesAt) : null,
      hasOfflineEvents: tournament.hasOfflineEvents,
      images: tournament.images.map(image => image.url),
      isRegistrationOpen: tournament.isRegistrationOpen,
      slug: tournament.slug,
      state: tournament.state,
      venueName: tournament.venueName,
      venueAddress: tournament.venueAddress,
      startAt: tournament.startAt ? fromUnixTime(tournament.startAt) : null,
    }

    if (isBefore(tourney.endAt, now)) {
      logger.warn(`Tourney ${tourney.name} is outdated, not upserting.`)
      return null
    }

    return prisma.tournament.upsert({
      where: {
        tournament_id: tournament.id
      },
      create: tourney,
      update: tourney
    })
  })

  return Promise.all(createTournaments)
}

export async function executeTournamentsQueries() {
  try {
    logger.info('Loading tournaments...')
    await loadTournaments()
    logger.info('Loaded tournaments')

    logger.info('Cleaning up tournaments')
    await cleanOutdatedTournaments()
    logger.info('Cleaned tournaments up')

    logger.info('Set tournements is_started to true for todays date')
    await setTournamentsStart()
    logger.info('Done setting tournaments')
  } catch (error) {
    logger.error('Error at executing tournament queries', error)
  }
}