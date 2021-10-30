import { PrismaClient, Role, User } from "@prisma/client";

export interface Context {
  user: User & {
    roles: Role[];
  },
  prisma: PrismaClient
}