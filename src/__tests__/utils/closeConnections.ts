import { ApolloServer } from "apollo-server-express"
import { prisma } from "../../prisma"
import { cache, pubsub } from "../../redis"

async function resetDatabase() {
  const deleteUsers = prisma.user.deleteMany()
  const deleteTournaments = prisma.tournament.deleteMany()
  const deleteCrews = prisma.crew.deleteMany()

  return prisma.$transaction([
    deleteUsers,
    deleteTournaments,
    deleteCrews
  ])
}

export default async function closeAllConnections(server: ApolloServer) {
  await resetDatabase()

  return Promise.all([
    prisma.$disconnect(),
    cache.disconnect(),
    pubsub.close(),
    server.stop()
  ])
}
