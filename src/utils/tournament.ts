import { gql } from "graphql-request"
import _ from "lodash"
import { prisma } from "../prisma"
import smashGGClient from "../smashGGClient"
import { IEvent, ITournament, SmashGG } from "../typings/interfaces"
import logger from "./logger"

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

const wait = (seconds: number) => new Promise(resolve => setTimeout(() => resolve(true), seconds * 1000))

export async function fetchAllEventParticipant(id: number, page = 1, event: IEvent = null): Promise<IEvent> {
  const query = gql`
    query TournamentQuery($id: ID!, $page: Int!) {
      event(id: $id) {
        id
        name
        numEntrants
        entrants(query: {
          page: $page,
          perPage: 250
        }) {
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
  const data = await smashGGClient.request<SmashGG.Event, SmashGG.EventArgs>(query, { page, id })
  const { nodes, pageInfo } = data.event.entrants

  // Set our accumulator
  event = {
    ...data.event,
    entrants: {
      ...data.event.entrants,
      nodes: [
        // If event is null, default to array
        ...event?.entrants.nodes ?? [],
        ...nodes
      ]
    }
  }

  logger.info(`event:${event.id} - fetching participants (page: ${page})`)

  // If we reached the end or no pages, return event
  if ((pageInfo.page === pageInfo.totalPages) || pageInfo.totalPages === 0) {
    logger.info(`event:${event.id} - fetched all participants (${event.entrants.nodes.length})`)
    return event
  } else {
    // Else we recursively fetch all tournaments
    await wait(1)
    return await fetchAllEventParticipant(id, pageInfo.page + 1, event)
  }
}

export async function fetchEvents(tournaments: ITournament[]) {
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

export async function fetchTournaments(accumulator: ITournament[] = [], page = 1): Promise<ITournament[]> {
  const query = gql`
    query TournamentQuery($page: Int!) {
      tournaments(query: {
        filter: {
          videogameIds: [1386]
          upcoming: true
        }
        sortBy: "startAt asc"
        page: $page
      }) {
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
          events(filter: {
            videogameId: 1386,
            type: 1
          }) {
            name
            id
          }
        }
      }
    }
  `
  const data = await smashGGClient.request<SmashGG.Tournament, SmashGG.TournamentArgs>(query, { page })
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

export async function getAllConnectedUsersForTournament(tournament: ITournament) {
  // Map users by their id
  const participants = tournament.events.map(e => e.entrants.nodes.map(t => {
    if (t.participants.length === 0) {
      logger.error(`Error in mapping entrants (event: ${e.id}): ${JSON.stringify(t)}`)
      return -1
    } else {
      return t.participants[0].player.id
    }
  })).flat()
  // Filter out duplicates
  const uniqueParticipants = _.uniq(participants)
  // Make DB calls to get users by their SmashGG player id
  const findUsersBySmashUserId = uniqueParticipants.map(participant => prisma.user.findUnique({ where: {smashgg_player_id: participant }}))
  // Execute batch
  const users = await prisma.$transaction(findUsersBySmashUserId)
  return users.filter(Boolean).map(user => ({ smashgg_player_id: user.smashgg_player_id }))
}