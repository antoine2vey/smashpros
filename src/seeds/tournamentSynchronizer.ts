import chalk from 'chalk'
import { fromUnixTime } from 'date-fns'
import dotenv from 'dotenv'
import fetch from "node-fetch"
import { prisma } from '../prisma'
import { Tournament } from '../resolvers/tournament'

// Load env
dotenv.config()

const log = (...args) => (colors) => console.log(colors('[SEED]', ...args))
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
          hasOfflineEvents: tournament.hasOfflineEvents,
          images: tournament.images,
          isRegistrationOpen: tournament.isRegistrationOpen,
          slug: tournament.slug,
          state: tournament.state,
          venueName: tournament.venueName,
          venueAddress: tournament.venueAddress,
          startAt: tournament.startAt ? fromUnixTime(tournament.startAt) : null,
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

log('Creating tourneys ...')(chalk.bold)
tournamentSynchronizer()
  .then(() => {
    log('Created all tournaments!')(chalk.green.bold)
  })
  .catch((error) => {
    log('Something bad happened while creating tourneys :(')(chalk.red.bold)
    log('Reason: ', error)(chalk.red.bold)
  })
  .finally(() => {
    process.exit(0)
  })