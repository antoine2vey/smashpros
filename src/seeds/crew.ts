import faker from '@faker-js/faker'
import { prisma } from '../prisma'
import logger from '../utils/logger'

const crews = Array(10)
  .fill(undefined)
  .map(() => {
    const team = faker.lorem.word()

    return {
      name: team[0].toUpperCase().concat(team.slice(1)),
      prefix: team.substring(0, 3).toUpperCase(),
      icon: faker.image.nightlife(),
      banner: faker.image.business()
    }
  })

export function loadCrews() {
  logger.info('Creating crews ...')
  const batch = []

  for (let crew of crews) {
    batch.push(
      prisma.crew.create({
        data: {
          name: crew.name,
          prefix: crew.prefix,
          icon: crew.icon,
          banner: crew.banner,
          admin: {
            connect: {
              id: undefined
            }
          }
        }
      })
    )
  }

  return Promise.all(batch)
}
