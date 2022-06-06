import { prisma } from '../../prisma'
import { cache, pubsub } from '../../redis'

export default async function closeAllConnections() {
  return Promise.all([prisma.$disconnect(), cache.disconnect(), pubsub.close()])
}
