import { objectType } from "nexus";
import { register } from "../resolvers/user";
import { UserRegisterPayload } from "./user";

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('register', {
      type: 'User',
      args: {
        payload: UserRegisterPayload
      },
      resolve(args) {
        return register(...args)
      }
    })
  }
})