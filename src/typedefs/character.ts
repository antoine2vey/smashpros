import { gql } from "apollo-server";

export const characterType = gql`
  type Character {
    id: ID
    name: String!
    picture: String!
  }

  extend type Query {
    characters: [Character!]
  }

  extend type Mutation {
    addCharacter(name: String!, picture: String!): Character!
  }
`