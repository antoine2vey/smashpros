import { endOfDay, fromUnixTime, isBefore, startOfDay } from 'date-fns'
import fetch from 'node-fetch'
import { prisma } from '../prisma'
import { Tournament } from '../typings/interfaces'
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

function loadTournaments() {
  const BASE_URL = 'https://api.smash.gg/gql/alpha'
  const variables = null
  const query = `
    query {
      tournaments(query: {
        filter: {
          countryCode: "FR"
          videogameIds: [1386]
          upcoming: true
        }
        sortBy: "startAt asc"
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

  return new Promise((resolve, reject) => {
    fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
      headers: {
        'authorization': 'Bearer ' + process.env.SMASHGG_API_KEY,
        'content-type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(async ({ data }) => {
      const tournaments: Tournament[] = data.tournaments.nodes
    
      // Create all tournaments, upsert if needed
      const createTournaments = tournaments.map(tournament => {
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

        const now = new Date()
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
      
      try {
        const tourneys = await Promise.all(createTournaments)
        resolve(tourneys)
      } catch (error) {
        reject(error)
      }
    })
  })
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