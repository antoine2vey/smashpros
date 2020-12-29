import { gql } from "apollo-server";

export const tournamentType = gql`
  scalar Date

  type Tournament {
    id: ID!
    tournament_id: ID!
    name: String!
    city: String
    countryCode: String!
    createdAt: Date
    currency: String!
    numAttendees: Int!
    endAt: Date
    eventRegistrationClosesAt: Date
    hasOfflineEvents: Boolean
    images: [TournamentImage!]
    isRegistrationOpen: Boolean
    lat: Float
    lng: Float
    slug: String!,
    state: Int!,
    venueName: String,
    venueAddress: String

    participants(query: TournamentQuery): [User]
    favorited_by: [User]
  }

  type TournamentImage {
    id: ID!
    url: String!
  }

  extend type Query {
    tournaments: [Tournament!]
    tournament(id: ID!): Tournament
  }

  input TournamentQuery {
    character: ID
    player: String
  }

  extend type Mutation {
    favoriteTournament(id: ID!, unfav: Boolean = false): Boolean!
    participateTournament(id: ID!, unparticipate: Boolean = false): Tournament!
  }
`