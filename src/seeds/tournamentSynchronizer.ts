import { fromUnixTime, isBefore } from 'date-fns'
import dotenv from 'dotenv'
import fetch from "node-fetch"
import { prisma } from '../prisma'
import { Tournament } from '../typings/interfaces'
import logger from '../utils/logger'

// Load env
dotenv.config()

const BASE_URL = 'https://api.smash.gg/gql/alpha'
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
const variables = null

function tournamentSynchronizer() {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL, {
      "method": "POST",
      "body": JSON.stringify({ query, variables }),
      "headers": {
        "authorization": "Bearer " + process.env.SMASHGG_API_KEY,
        "content-type": "application/json"
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
          logger.warn(`Tourney ${tourney.name} is outdated, not upserting. (${tourney.endAt})`)
          return null
        }

        // It's an online tournament, dont put it
        if (!tournament.hasOfflineEvents) {
          logger.warn(`Tourney ${tourney.name} is online, not upserting.`)
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

logger.info('Creating tourneys')
tournamentSynchronizer()
  .then(() => {
    logger.info('Created all tournaments!')
  })
  .catch((error) => {
    logger.error('Something bad happened while creating tourneys', error)
  })
  .finally(() => {
    process.exit(0)
  })