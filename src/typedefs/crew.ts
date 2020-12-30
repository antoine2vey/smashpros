import { gql } from "apollo-server";

export const crewType = gql`
  type Crew {
    id: ID
    name: String
    prefix: String
    members: [User]
  }

  extend type Query {
    crews: [Crew!]
    crew: Crew
  }

  extend type Mutation {
    createCrew(name: String!, prefix: String!): Crew
    joinCrew(id: ID!): Crew
    updateWaitingMember(id: ID!, action: String!): Crew
    kickMember(id: ID!): Crew
  }
`