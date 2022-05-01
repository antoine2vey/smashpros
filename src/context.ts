import { PrismaClient, Role, User } from '@prisma/client'
import { Request } from 'express'

export interface Context {
  user: User & {
    roles: Role[]
  }
  prisma: PrismaClient
  req: Request
}
