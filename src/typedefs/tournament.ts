import { gql } from "apollo-server";

export const tournamentTypes = gql`
  type Tournament {
    tournament_id: ID!
    name: String!
    city: String!
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
  }

  type TournamentImage {
    id: ID!
    url: String!
  }

  extend type Query {
    tournaments: [Tournament!]
  }
`