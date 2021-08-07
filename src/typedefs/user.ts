import { gql } from "apollo-server";

export const userType = gql`
  scalar Upload

  type Role {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    email: String!
    tag: String!
    profile_picture: String!
    characters: [Character!]
    roles: [Role]
    is_checked_in: Boolean
    in_tournament: Boolean
  }

  type RegisterPayload {
    success: Boolean
  }

  type AuthPayload {
    token: String!
  }

  input UserRegisterPayload {
    email: String!
    password: String!
    tag: String!
    profilePicture: Upload
    characters: [ID!]
  }

  input UserUpdatePayload {
    id: String!
    email: String!
    tag: String!
    profilePicture: Upload
    characters: [ID!]
  }

  extend type Query {
    users: [User!]
    usersByCharacter(characterId: ID!): [User!]
  }

  extend type Mutation {
    register(payload: UserRegisterPayload): User!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(payload: UserUpdatePayload!): User!
    askPasswordReset(email: String!): String!
    passwordReset(code: String!, password: String!, confirm_password: String!): Boolean!
  }

  extend type Subscription {
    userEnteredTournament: User!
  }
`