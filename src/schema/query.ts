import { list, objectType } from "nexus";
import { Context } from "../context";

export const Query = objectType({
  name: 'Query',
  definition: (t) => {
    t.field('characters', {
      type: list('Character'),
      resolve(_, args, ctx: Context) {
        return ctx.prisma.character.findMany({
          include: {
            users: true
          }
        })
      }
    })

    t.field('tournaments', {
      type: list('Tournament'),
      resolve(_, args, ctx: Context) {
        return ctx.prisma.tournament.findMany({
          include: {
            participants: true,
            favorited_by: true,
            organizers: true
          }
        })
      }
    })
  }
})