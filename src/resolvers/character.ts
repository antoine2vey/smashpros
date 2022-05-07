import { prisma } from '../prisma'
import { QueryArg } from '../typings/interfaces'

export const characters: QueryArg<'characters'> = (_, args, ctx, info) => {
  return prisma.character.findMany()
}
