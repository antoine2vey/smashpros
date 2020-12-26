import { gql, IResolvers } from "apollo-server";
import { DocumentNode } from "graphql";
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
`
const typeDefs: DocumentNode[] = [root, characterType, userType, tournamentType]

export {
  typeDefs
}