import { gql, IResolvers } from "apollo-server";
import { DocumentNode } from "graphql";
import { crewType } from "./crew";
import { characterType } from "./character";
import { tournamentType } from "./tournament";
import { userType } from "./user";

const root = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`
const typeDefs: DocumentNode[] = [root, characterType, userType, tournamentType, crewType]

export {
  typeDefs
}