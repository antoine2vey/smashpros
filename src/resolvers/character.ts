import { QueryArg } from "../typings/interfaces"

export const characters: QueryArg<"characters"> = (_, args, ctx, info) => {
  return ctx.prisma.character.findMany()
}